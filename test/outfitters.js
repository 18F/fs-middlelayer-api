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
const server = include('src/index.js');
const util = include('test/utility.js');

const AWS = require('aws-sdk-mock');
const sinon = require('sinon');
const fs = require('fs');

const factory = require('unionized');
const tempOutfitterInput = include('test/data/testInputTempOutfitters.json');
const tempOutfitterObjects = include('test/data/testObjects.json');
const testURL = '/permits/applications/special-uses/commercial/temp-outfitters/';

const chai = require('chai');
const expect = chai.expect;
const bcrypt = require('bcrypt-nodejs');
const db = include('src/controllers/db.js');
const models = include('src/models');

const adminCredentials = util.makeUserEntry('admin');

const specialUses = {};

specialUses.fileValidate = require('../src/controllers/fileValidation.js');
specialUses.validation = require('../src/controllers/validation.js');

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

function mockZip(){
	return '';
}

//*******************************************************************

describe('API Routes: permits/special-uses/commercial/outfitters', function() {

	let token;
	let postControlNumber;
	let postFileName; //eslint-disable-line no-unused-vars
	// eslint complains about postFileName not being used, but it's used below.

	beforeEach(function(done) {

		models.users.sync({ force: false });
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(adminCredentials.pwd, salt);

		const adminUser = {
			userName: adminCredentials.un,
			passHash: hash,
			userRole: 'admin'
		};

		db.saveUser(adminUser, function(err){
			if (err){
				return false;
			}
			else {

				util.getToken(adminCredentials.un, adminCredentials.pwd, function(t){
					token = t;
					return done();
				});

			}
		});

		AWS.mock('S3', 'putObject', {});
		AWS.mock('S3', 'getObject', {});

	});

	afterEach(function(done) {

		db.deleteUser(adminCredentials.un, function(err){
			if (err){
				return false;
			}
			else {
				return done();
			}
		});

		AWS.restore('S3');

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

	describe('tempOutfitters POST files:', function(){

		it('should return errors for file that is too large', function(){
			const Validator = new specialUses.validation.ValidationClass({}, {});
			expect (
				
				specialUses.fileValidate.validateFile(tempOutfitterObjects.file.uploadFile_20MB, tempOutfitterObjects.file.validationConstraints, 'insuranceCertificate', Validator).length
			)
			.to.be.equal(1);
		});
		it('should return errors for file that is too small', function(){
			const Validator = new specialUses.validation.ValidationClass({}, {});
			expect (
				specialUses.fileValidate.validateFile(tempOutfitterObjects.file.uploadFile_empty, tempOutfitterObjects.file.validationConstraints, 'insuranceCertificate', Validator).length
			)
			.to.be.equal(1);
		});
		it('should return errors for file that is the wrong mime type', function(){
			const Validator = new specialUses.validation.ValidationClass({}, {});
			expect (
				specialUses.fileValidate.validateFile(tempOutfitterObjects.file.uploadFile_invalid_mime, tempOutfitterObjects.file.validationConstraints, 'insuranceCertificate', Validator).length
			)
			.to.be.equal(1);
		});

		it('should return valid json missing single required file', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				// .attach('insuranceCertificate', './test/data/test_insuranceCertificate.docx')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.docx')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.message).to.equal('Insurance Certificate is a required file.');

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

	describe('tempOutfitters GET/POST files: post a new application with files, get that application, get file', function(){

		it('should return valid json when application submitted with three required files', function(done) {

			this.timeout(10000);

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

		it('should return intakeId in json when getting outfitters permit using the controlNumber returned from POST', function(done) {

			request(server)
			.get(`${testURL}${postControlNumber}/`)
			.set('x-access-token', token)
			.expect(function(res){
				expect(res.body.intakeId).to.equal(90);
			})
			.expect(200, done);
		});

		it('should return valid file when getting outfitters files using the controlNumber and fileName returned from POST', function(done) {
			const getObjSpy = sinon.spy();
			const postFileName = 'insuranceCertificate.doc';
			const dbStub = sinon.stub(db, 'getFileInfoFromDB').resolves({ 'fileName': postFileName});
			AWS.restore('S3');
			AWS.mock('S3', 'getObject', new Buffer(fs.readFileSync('./test/data/test_insuranceCertificate.docx')), getObjSpy);
			request(server)
			.get(`${testURL}${postControlNumber}/files/${postFileName}`)
			.set('x-access-token', token)
			.expect(200)
			.expect(function(res){
				if (res){
					dbStub.restore();
					return true;
				} 
				else {
					return false;
				}
			})
			.buffer()
			.parse(binaryParser)
			.end(function(err) {
				if (err)
					return done(err);

				expect(200, done);
				done();
			});

		});

		it('should return valid json (404) when getting files using the controlNumber and invalid fileName', function(done) {

			request(server)
			.get(`${testURL}${postControlNumber}/files/fileNotAvailable.pdf`)
			.set('x-access-token', token)
			.expect(404, done);
		});
	});

});
describe('tempOutfitters GET/POST zip file validation: ', function(){

	let token;
	let postControlNumber;

	before(function(done) {

		if (process.env.npm_config_mock === 'Y'){
			mockZip();
		}

		models.users.sync({ force: false });
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(adminCredentials.pwd, salt);

		const adminUser = {
			userName: adminCredentials.un,
			passHash: hash,
			userRole: 'admin'
		};

		db.saveUser(adminUser, function(err){
			if (err){
				return false;
			}
			else {

				util.getToken(adminCredentials.un, adminCredentials.pwd, function(t){
					token = t;
					return done();
				});

			}
		});

	});

	after(function(done) {

		db.deleteUser(adminCredentials.un, function(err){
			if (err){
				return false;
			}
			else {
				return done();
			}
		});

	});

	describe('post a new application with files, get that application, get files zipped', function(){

		it('should return valid json when application submitted with three required files', function(done) {

			this.timeout(10000);

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

		xit('should return valid zip when getting outfitters files using the controlNumber returned from POST', function(done) {

			this.timeout(10000);

			request(server)
			.get(`${testURL}${postControlNumber}/files/`)
			.set('x-access-token', token)
			.expect(200)
			.expect(function(res){
				if (res.headers['Content-Type'] === 'application/zip; charset=utf-8' || res.headers['Content-Type'] === 'application/zip'){
					return true;
				}
				else {
					return false;
				}
			})
			.buffer()
			.parse(binaryParser)
			.end(function(err) {
				if (err)
					return done(err);

				expect(200, done);
				done();
			});

		});
	});
});
