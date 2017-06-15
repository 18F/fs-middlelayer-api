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

const s3zipper = require ('aws-s3-zipper');
const sinon = require('sinon');

const factory = require('unionized');
const tempOutfitterInput = include('test/data/testInputTempOutfitters.json');
const tempOutfitterObjects = include('test/data/testObjects.json');
const testURL = '/permits/applications/special-uses/commercial/temp-outfitters/';

const chai = require('chai');
const expect = chai.expect;
const bcrypt = require('bcrypt-nodejs');
const db = include('src/controllers/db.js');
const models = include('src/models');

const adminUsername = 'admin' + (Math.floor((Math.random() * 1000000) + 1)).toString();
const adminPassword = 'pwd' + (Math.floor((Math.random() * 1000000) + 1)).toString();

const specialUses = {};

specialUses.fileValidate = require('../src/controllers/fileValidation.js');

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
	sinon.stub(s3zipper.prototype, 'getFiles').callsFake(function(data, callback){
		const output = {
			'files': [
				{
					'Key': '6368078106/goodStandingEvidence-test_file-1496157956097.docx',
					'LastModified': '2017-05-30T15:25:56.000Z',
					'ETag': '\'ee89f00c853e139cb590fe1abb14d700\'',
					'Size': 420095,
					'StorageClass': 'STANDARD',
					'Owner': {
						'DisplayName': 'christopher.continanza+bucketeer1',
						'ID': '200230aeea1c348284c04a2cf8b9e4033d22b483b0a230613bbc9061962935a9'
					}
				},
				{
					'Key': '6368078106/insuranceCertificate-test_file-1496157956067.doc',
					'LastModified': '2017-05-30T15:25:56.000Z',
					'ETag': '\'38d0e2a6bd4dfb4681e1f2f71b39c9ca\'',
					'Size': 22016,
					'StorageClass': 'STANDARD',
					'Owner': {
						'DisplayName': 'christopher.continanza+bucketeer1',
						'ID': '200230aeea1c348284c04a2cf8b9e4033d22b483b0a230613bbc9061962935a9'
					}
				},
				{
					'Key': '6368078106/operatingPlan-test_file-1496157956101.pdf',
					'LastModified': '2017-05-30T15:25:56.000Z',
					'ETag': '\'fa7d7e650b2cec68f302b31ba28235d8\'',
					'Size': 7945,
					'StorageClass': 'STANDARD',
					'Owner': {
						'DisplayName': 'christopher.continanza+bucketeer1',
						'ID': '200230aeea1c348284c04a2cf8b9e4033d22b483b0a230613bbc9061962935a9'
					}
				}
			],
			'totalFilesScanned': 3,
			'lastScannedFile': {
				'Key': '6368078106/operatingPlan-test_file-1496157956101.pdf',
				'LastModified': '2017-05-30T15:25:56.000Z',
				'ETag': '\'fa7d7e650b2cec68f302b31ba28235d8\'',
				'Size': 7945,
				'StorageClass': 'STANDARD',
				'Owner': {
					'DisplayName': 'christopher.continanza+bucketeer1',
					'ID': '200230aeea1c348284c04a2cf8b9e4033d22b483b0a230613bbc9061962935a9'
				}
			}
		};
		return callback(null, output);
	});
	sinon.stub(s3zipper.prototype, 'streamZipDataTo').callsFake(function(params, callback){
		console.log('replaced streamZipDataTo');
		params.pipe.json('');
		return callback(null, 'result');
	});
}
function unmockZip(){
	s3zipper.prototype.getFiles.restore();
	s3zipper.prototype.streamZipDataTo.restore();
}

//*******************************************************************

describe('API Routes: permits/special-uses/commercial/outfitters', function() {
	
	let token;
	let postControlNumber;
	let postFileName;

	before(function(done) {

		models.users.sync({ force: false });
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(adminPassword, salt);

		const adminUser = {
			userName: adminUsername, 
			passHash: hash, 
			userRole: 'admin'
		};

		db.saveUser(adminUser, function(err){
			if (err){
				return false;
			}
			else {
				
				util.getToken(adminUsername, adminPassword, function(t){
					token = t;
					return done();
				});
					
			}
		});
	
	});

	after(function(done) {

		db.deleteUser(adminUsername, function(err){
			if (err){
				return false;
			}
			else {
				return done();
			}
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

	describe('tempOutfitters POST files:', function(){

		it('should return errors for file that is too large', function(){
			expect (
				specialUses.fileValidate.validateFile(tempOutfitterObjects.file.uploadFile_20MB, tempOutfitterObjects.file.validationConstraints, 'insuranceCertificate').length
			)
			.to.be.equal(1);
		});
		it('should return errors for file that is too small', function(){
			expect (
				specialUses.fileValidate.validateFile(tempOutfitterObjects.file.uploadFile_empty, tempOutfitterObjects.file.validationConstraints, 'insuranceCertificate').length
			)
			.to.be.equal(1);
		});
		it('should return errors for file that is the wrong mime type', function(){
			expect (
				specialUses.fileValidate.validateFile(tempOutfitterObjects.file.uploadFile_invalid_mime, tempOutfitterObjects.file.validationConstraints, 'insuranceCertificate').length
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

		it('should return valid file when getting outfitters files using the controlNumber and fileName returned from POST', function(done) {

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
		const hash = bcrypt.hashSync(adminPassword, salt);

		const adminUser = {
			userName: adminUsername, 
			passHash: hash, 
			userRole: 'admin'
		};

		db.saveUser(adminUser, function(err){
			if (err){
				return false;
			}
			else {
				
				util.getToken(adminUsername, adminPassword, function(t){
					token = t;
					return done();
				});
					
			}
		});
	
	});

	after(function(done) {

		if (process.env.npm_config_mock === 'Y'){
			unmockZip();
		}
		
		db.deleteUser(adminUsername, function(err){
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

		it('should return valid zip when getting outfitters files using the controlNumber returned from POST', function(done) {

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
