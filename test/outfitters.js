/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) "_| "  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

const include = require('include')(__dirname);

//*******************************************************************

const request = require('supertest');
const sinon = require('sinon');
const server = include('src/index.js');
const util = include('test/utility.js');

const factory = require('unionized');
const tempOutfitterInput = include('test/data/testInputTempOutfitters.json');
const tempOutfitterObjects = include('test/data/testObjects.json');
const testURL = '/permits/applications/special-uses/commercial/temp-outfitters/';

const chai = require('chai');
const expect = chai.expect;

const specialUses = {};

specialUses.validate = require('../src/controllers/validation.js');

//*******************************************************************
//Mock Input

const tempOutfitterFactory = factory.factory(tempOutfitterInput);

const binaryParser = function (res, cb) {
	res.setEncoding('binary');
	res.data = '';
	res.on('data', function (chunk) {
		res.data += chunk;
	});
	res.on('end', function () {
		cb(null, new Buffer(res.data, 'binary'));
	});
};

//*******************************************************************

describe('API Routes: permits/special-uses/commercial/outfitters', function() {
	
	let token;
	let postControlNumber;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	it('should return valid json for tempOutfitters POST (controlNumber to be used in GET)', function(done) {
			
		this.timeout(5000);

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create()))
			.attach('insuranceCertificate', './test/data/test_file.doc')
			.attach('goodStandingEvidence', './test/data/test_file.docx')
			.attach('operatingPlan', './test/data/test_file.pdf')
			.expect('Content-Type', /json/)
			.expect(function(res){
				postControlNumber = res.body.controlNumber;
			})
			.expect(200, done);

	});
	
	it('should return valid json for tempOutfitters GET request for id', function(done) {

		request(server)
			.get(`${testURL}${postControlNumber}/`)
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

});

describe('tempOutfitters POST: file validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});

	});
	
	describe('tempOutfitters POST: required files checks', function(){

		it('should return errors for file that is too large', function(){
			expect (
				specialUses.validate.validateFile(tempOutfitterObjects.file.uploadFile_20MB, tempOutfitterObjects.file.validationConstraints, 'insuranceCertificate').length
			)
			.to.be.equal(1);
		});
		it('should return errors for file that is too small', function(){
			expect (
				specialUses.validate.validateFile(tempOutfitterObjects.file.uploadFile_empty, tempOutfitterObjects.file.validationConstraints, 'insuranceCertificate').length
			)
			.to.be.equal(1);
		});

		it('should return valid json missing single required file', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.docx')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.docx')
				.expect('Content-Type', /json/)
				.expect(function(res){
					
					expect(res.body.message).to.equal('Operating Plan is a required file.');

				})
				.expect(400, done);

		});

		it('should return valid json missing multiple required files', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.docx')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.docx')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.docx')
				.expect('Content-Type', /json/)
				.expect(function(res){
					
					expect(res.body.message).to.equal('Good Standing Evidence is a required file. Operating Plan is a required file.');

				})
				.expect(400, done);

		});

		it('should return valid json with error messages for an invalid file (invalid extension)', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.docx')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.docx')
				.attach('operatingPlan', './test/data/test_invalidExtension.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){
					
					expect(res.body.message).to.equal('Operating Plan must be one of the following extensions: pdf, doc, docx, rtf.');

				})
				.expect(400, done);

		});

		it('should return valid json when all required three files provided', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.docx')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.docx')
				.attach('operatingPlan', './test/data/test_operatingPlan.docx')
				.expect('Content-Type', /json/)
				.expect(200, done);

		});

	});
});

describe('tempOutfitters GET: files validated', function(){

	let token;

	let postControlNumber;
	let postFileName;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});

	});
	
	describe('tempOutfitters GET/POST: post a new application with files, get that application, get file', function(){

		it('should return valid json when application submitted with three required files', function(done) {
			
			this.timeout(5000);

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				.attach('insuranceCertificate', './test/data/test_file.doc')
				.attach('goodStandingEvidence', './test/data/test_file.docx')
				.attach('operatingPlan', './test/data/test_file.pdf')
				.expect('Content-Type', /json/)
				.expect(function(res){
					postControlNumber = res.body.controlNumber;
				})
				.expect(200, done);

		});

		it('should return valid json when getting outfitters permit using the controlNumber returned from POST', function(done) {

			request(server)
			.get(`${testURL}${postControlNumber}/`)
			.set('x-access-token', token)
			.expect(function(res){
				postFileName = res.body.tempOutfitterFields.operatingPlan;
			})
			.expect(200, done);

		});

		it('should return valid json when getting outfitters files using the controlNumber and fileName returned from POST', function(done) {

			request(server)
			.get(`${testURL}${postControlNumber}/files/${postFileName}`)
			.set('x-access-token', token)
			.expect(200)
			.expect(function(res){
				if (res.headers['Content-Type'] === 'application/pdf; charset=utf-8' || res.headers['Content-Type'] === 'application/pdf'){
					return true;
				}
				else {
					return false;
				}
			})
			.buffer()
			.parse(binaryParser)
			.end(function(err, res) {
				if (err) 
					return done(err);
				
				expect(200, done);
				done();
			});

		});
	});
});
