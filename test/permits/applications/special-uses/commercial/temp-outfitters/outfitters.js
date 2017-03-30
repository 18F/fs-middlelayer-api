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
const server = include('index.js');
const util = include('test/utility.js');

const factory = require('unionized');
const tempOutfitterInput = include('test/data/testInputTempOutfitters.json');

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************
//Mock Input

const tempOutfitterFactory = factory.factory(tempOutfitterInput);

//*******************************************************************

describe('tempOutfitters POST: validate required fields present', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('body fields', function(){

		it('should return valid json with a 400 status code for tempOutfitters POST request without a body', function(done) {
		
			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Region is a required field. Forest is a required field. District is a required field. Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field. Applicant Info/Org Type is a required field. Type is a required field. Temp Outfitter Fields/Activity Description is a required field. Temp Outfitter Fields/Insurance Certificate is a required field. Temp Outfitter Fields/Good Standing Evidence is a required field. Temp Outfitter Fields/Operating Plan is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without an applicantInfo object', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({applicantInfo : undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field. Applicant Info/Org Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a tempOutfitterFields object', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({tempOutfitterFields : undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Activity Description is a required field. Temp Outfitter Fields/Insurance Certificate is a required field. Temp Outfitter Fields/Good Standing Evidence is a required field. Temp Outfitter Fields/Operating Plan is a required field.');

				})
				.expect(400, done);

		});

	});

	describe('applicantInfo fields', function(){

		it('should return valid json with a 400 status code for tempOutfitters POST request without a firstName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.firstName':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a lastName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.lastName':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Last Name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a dayPhone', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a dayPhone/areaCode', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.areaCode':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a dayPhone/number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.number':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a dayPhone/type', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.type':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without an emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.emailAddress':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a mailingAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingAddress':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a mailingCity', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingCity':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing City is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a mailingState', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingState':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing State is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without a mailingZIP', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingZIP':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt').expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without an orgType', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.orgType':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Org Type is a required field.');

				})
				.expect(400, done);

		});

	});

	describe('validate required fields present: tempOutfitters fields', function(){

		it('should return valid json with a 400 status code for tempOutfitters POST request without an activityDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'tempOutfitterFields.activityDescription':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Activity Description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without an insuranceCertificate', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'tempOutfitterFields.insuranceCertificate':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Insurance Certificate is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without an goodStandingEvidence', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'tempOutfitterFields.goodStandingEvidence':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Good Standing Evidence is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for tempOutfitters POST request without an operatingPlan', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'tempOutfitterFields.operatingPlan':undefined})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Operating Plan is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for an invalid tempOutfitters POST request', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({
					'tempOutfitterFields.insuranceCertificate':undefined,
					'tempOutfitterFields.goodStandingEvidence':undefined
				})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Insurance Certificate is a required field. Temp Outfitter Fields/Good Standing Evidence is a required field.');

				})
				.expect(400, done);

		});

	});

});

describe('API Routes: permits/special-uses/commercial/outfitters', function() {
	
	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});
	
	it('should return valid json for tempOutfitters GET request for id', function(done) {

		request(server)
			.get('/permits/applications/special-uses/commercial/temp-outfitters/1234567890')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for tempOutfitters PUT request for id', function(done) {

		request(server)
			.put('/permits/applications/special-uses/commercial/temp-outfitters/1234')
			.set('x-access-token', token)
			.send(tempOutfitterFactory.create())
			.expect('Content-Type', /json/)
			.expect(200, done);

	});
	
	it('should return valid json for tempOutfitters POST request', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/temp-outfitters')
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create()))
			.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
			.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
			.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
			.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
			.attach('operatingPlan', './test/data/test_operatingPlan.txt')
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for tempOutfitters POST request with apiRequest', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/temp-outfitters')
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create()))
			.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
			.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
			.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
			.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
			.attach('operatingPlan', './test/data/test_operatingPlan.txt')
			.expect('Content-Type', /json/)
			.expect(function(res){
				expect(res.body).to.have.property('apiRequest');
			})	
			.expect(200, done);

	});

});

describe('tempOutfitters PUT: field type validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('tempOutfitters PUT: required fields are type validated', function(){

		it('should return valid json with error if no updated provided', function(done) {

			request(server)
				.put('/permits/applications/special-uses/commercial/temp-outfitters/123')
				.set('x-access-token', token)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Region is a required field. Forest is a required field. District is a required field. Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field. Applicant Info/Org Type is a required field. Type is a required field. Temp Outfitter Fields/Activity Description is a required field. Temp Outfitter Fields/Insurance Certificate is a required field. Temp Outfitter Fields/Good Standing Evidence is a required field. Temp Outfitter Fields/Operating Plan is a required field.');

				})
				.expect(400, done);

		});
	});
});

describe('tempOutfitters POST: field type validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('tempOutfitters POST: required fields are type validated', function(){

		it('should return valid json for invalid type, firstName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.firstName':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, lastName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.lastName':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Last Name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, areaCode', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.areaCode':'123'})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.number':'123'})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, type', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.type':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Type is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.emailAddress':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingAddress':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingCity', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingCity':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing City is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingState':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing State is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingZIP', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingZIP':12345})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, activityDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'tempOutfitterFields.activityDescription':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Activity Description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

	});

	describe('tempOutfitters POST: non-required fields are type validated', function(){

		it('should return valid json for invalid type, extension', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.extension':1})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Extension is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

	});

});

describe('tempOutfitters POST: format validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('tempOutfitters POST: fields with a specific format are validated', function(){

		it('should return valid json for invalid format, areaCode', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.areaCode':1234})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code must be 3 digits.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid format, number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.dayPhone.number':45678901})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number must be 7 digits.');

				})
				.expect(400, done);

		});

	});

	it('should return valid json for invalid format, mailingState', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/temp-outfitters/')
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingState':'ORE'})))
			.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
			.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
			.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
			.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
			.attach('operatingPlan', './test/data/test_operatingPlan.txt')
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Applicant Info/Mailing State must be 2 letters.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, mailingZIP', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/temp-outfitters/')
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingZIP':'1234'})))
			.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
			.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
			.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
			.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
			.attach('operatingPlan', './test/data/test_operatingPlan.txt')
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip must be 5 or 9 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for valid format, mailingZIP', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/temp-outfitters/')
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.mailingZIP':'123456789'})))
			.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
			.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
			.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
			.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
			.attach('operatingPlan', './test/data/test_operatingPlan.txt')
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for invalid format, region', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/temp-outfitters/')
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create({'region':'123'})))
			.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
			.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
			.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
			.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
			.attach('operatingPlan', './test/data/test_operatingPlan.txt')
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Region must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, forest', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/temp-outfitters/')
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create({'forest':'123'})))
			.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
			.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
			.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
			.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
			.attach('operatingPlan', './test/data/test_operatingPlan.txt')
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Forest must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, district', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/temp-outfitters/')
			.set('x-access-token', token)
			.field('body', JSON.stringify(tempOutfitterFactory.create({'district':'123'})))
			.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
			.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
			.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
			.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
			.attach('operatingPlan', './test/data/test_operatingPlan.txt')
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('District must be 2 digits.');

			})
			.expect(400, done);

	});

});

describe('tempOutfitters POST: enum validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});
	
	describe('tempOutfitters POST: fields with enumuration are validated', function(){

		it('should return valid json for invalid option, orgType', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.orgType':'invalid'})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){
					
					expect(res.body.response.message).to.equal('Applicant Info/Org Type is not one of enum values: Individual,Corporation,Limited Liability Company,Partnership or Association,State Government or Agency,Local Government or Agency,Nonprofit.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid option, type', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'type':'invalid'})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Type is not one of enum values: noncommercial,tempOutfitters.');

				})
				.expect(400, done);

		});

	});

});

describe('tempOutfitters POST: pattern validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('tempOutfitters POST: fields with a regex pattern are validated', function(){

		it('should return valid json for invalid pattern, emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create({'applicantInfo.emailAddress':'invalid'})))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.attach('operatingPlan', './test/data/test_operatingPlan.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address must be in format \'email@email.service\'.');

				})
				.expect(400, done);

		});
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

		it('should return valid json missing single file', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.attach('goodStandingEvidence', './test/data/test_goodStandingEvidence.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){
					
					expect(res.body.response.message).to.equal('operatingPlan must be provided.');

				})
				.expect(400, done);

		});

		it('should return valid json missing multiple files', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				.attach('guideDocumentation', './test/data/test_guideDocumentation.txt')
				.attach('acknowledgementOfRiskForm', './test/data/test_acknowledgementOfRiskForm.txt')
				.attach('insuranceCertificate', './test/data/test_insuranceCertificate.txt')
				.expect('Content-Type', /json/)
				.expect(function(res){
					
					expect(res.body.response.message).to.equal('goodStandingEvidence must be provided. operatingPlan must be provided.');

				})
				.expect(400, done);

		});

		it('should return valid json missing all files', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/temp-outfitters/')
				.set('x-access-token', token)
				.field('body', JSON.stringify(tempOutfitterFactory.create()))
				.expect('Content-Type', /json/)
				.expect(function(res){
					
					expect(res.body.response.message).to.equal('guideDocumentation must be provided. acknowledgementOfRiskForm must be provided. insuranceCertificate must be provided. goodStandingEvidence must be provided. operatingPlan must be provided.');

				})
				.expect(400, done);

		});

	});
});

