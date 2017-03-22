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
const tempOutfittersInput = include('test/data/testInputOutfitters.json');

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************
//Mock Input

const tempOutfittersFactory = factory.factory(tempOutfittersInput);

//*******************************************************************

describe('outfitters POST: validate required fields present', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('body fields', function(){

		it('should return valid json with a 400 status code for outfitters POST request without a body', function(done) {
		
			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Region is a required field. Forest is a required field. District is a required field. Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field. Applicant Info/Org Type is a required field. Type is a required field. Temp Outfitter Fields/Activity Description is a required field. Temp Outfitter Fields/Location Description is a required field. Temp Outfitter Fields/Start Date Time is a required field. Temp Outfitter Fields/End Date Time is a required field. Temp Outfitter Fields/Insurance Certificate is a required field. Temp Outfitter Fields/Good Standing Evidence is a required field. Temp Outfitter Fields/Operating Plan is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an applicantInfo object', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({applicantInfo : undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field. Applicant Info/Org Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a tempOutfitterFields object', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({tempOutfitterFields : undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Activity Description is a required field. Temp Outfitter Fields/Location Description is a required field. Temp Outfitter Fields/Start Date Time is a required field. Temp Outfitter Fields/End Date Time is a required field. Temp Outfitter Fields/Insurance Certificate is a required field. Temp Outfitter Fields/Good Standing Evidence is a required field. Temp Outfitter Fields/Operating Plan is a required field.');

				})
				.expect(400, done);

		});

	});

	describe('applicantInfo fields', function(){

		it('should return valid json with a 400 status code for outfitters POST request without a firstName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.firstName':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a lastName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.lastName':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Last Name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/areaCode', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.areaCode':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.number':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/type', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.type':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.emailAddress':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a mailingAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.mailingAddress':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a mailingCity', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.mailingCity':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing City is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a mailingState', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.mailingState':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing State is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a mailingZIP', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.mailingZIP':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an orgType', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.orgType':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Org Type is a required field.');

				})
				.expect(400, done);

		});

	});

	describe('validate required fields present: outfitters fields', function(){

		it('should return valid json with a 400 status code for outfitters POST request without an activityDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.activityDescription':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Activity Description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a locationDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.locationDescription':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Location Description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a startDateTime', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.startDateTime':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Start Date Time is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an endDateTime', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.endDateTime':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/End Date Time is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an insuranceCertificate', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.insuranceCertificate':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Insurance Certificate is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an goodStandingEvidence', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.goodStandingEvidence':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Good Standing Evidence is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an operatingPlan', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.operatingPlan':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Operating Plan is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for an invalid outfitters POST request', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({
					'tempOutfitterFields.insuranceCertificate':undefined,
					'tempOutfitterFields.goodStandingEvidence':undefined
				}))
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
	
	it('should return valid json for outfitters GET request for id', function(done) {

		request(server)
			.get('/permits/applications/special-uses/commercial/outfitters/1234567890')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for outfitters PUT request for id', function(done) {

		request(server)
			.put('/permits/applications/special-uses/commercial/outfitters/1234')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create())
			.expect('Content-Type', /json/)
			.expect(200, done);

	});
	
	it('should return valid json for outfitters POST request', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create())
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for outfitters POST request with apiRequest', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create())
			.expect('Content-Type', /json/)
			.expect(function(res){
				expect(res.body).to.have.property('apiRequest');
			})	
			.expect(200, done);

	});

});

describe('outfitters POST: field type validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('outfitters POST: required fields are type validated', function(){

		it('should return valid json for invalid type, firstName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.firstName':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, lastName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.lastName':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Last Name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, areaCode', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.areaCode':'123'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.number':'123'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, type', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.type':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Type is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.emailAddress':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.mailingAddress':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingCity', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.mailingCity':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing City is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.mailingState':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing State is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingZIP', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.mailingZIP':'12345'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, activityDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.activityDescription':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Activity Description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, locationDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.locationDescription':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Location Description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, startDateTime', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.startDateTime':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/Start Date Time is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, endDateTime', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'tempOutfitterFields.endDateTime':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp Outfitter Fields/End Date Time is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

	});

	describe('noncommercial POST: non-required fields are type validated', function(){

		it('should return valid json for invalid type, extension', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.extension':'1'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Extension is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

	});

});

describe('outfitters POST: format validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('outfitters POST: fields with a specific format are validated', function(){

		it('should return valid json for invalid format, areaCode', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.areaCode':1234}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code must be 3 digits.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid format, number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.dayPhone.number':45678901}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number must be 7 digits.');

				})
				.expect(400, done);

		});

	});

	it('should return valid json for invalid format, mailingState', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create({'applicantInfo.mailingState':'ORE'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Applicant Info/Mailing State must be 2 letters.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, mailingZIP', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create({'applicantInfo.mailingZIP':1234}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip must be 5 or 9 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for valid format, mailingZIP', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create({'applicantInfo.mailingZIP':123456789}))
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for invalid format, region', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create({'region':123}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Region must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, forest', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create({'forest':123}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Forest must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, district', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create({'district':123}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('District must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, startDateTime', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create({'tempOutfitterFields.startDateTime':'01-02-2012'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Temp Outfitter Fields/Start Date Time must be in format \'YYYY-MM-DDThh:mm:ssZ\'.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, endDateTime', function(done) {

		request(server)
			.post('/permits/applications/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(tempOutfittersFactory.create({'tempOutfitterFields.endDateTime':'01-02-2012'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Temp Outfitter Fields/End Date Time must be in format \'YYYY-MM-DDThh:mm:ssZ\'.');

			})
			.expect(400, done);

	});

});

describe('outfitters POST: enum validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('outfitters POST: fields with enumuration are validated', function(){

		it('should return valid json for invalid option, type', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'type':'invalid'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Type is not one of enum values: noncommercial,tempOutfitterGuide.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid option, orgType', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.orgType':'invalid'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Org Type is not one of enum values: Individual,Corporation,Limited Liability Company,Partnership or Association,State Government or Agency,Local Government or Agency,Nonprofit.');

				})
				.expect(400, done);

		});

	});

});

describe('outfitters POST: pattern validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('outfitters POST: fields with a regex pattern are validated', function(){

		it('should return valid json for invalid pattern, emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(tempOutfittersFactory.create({'applicantInfo.emailAddress':'invalid'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address must be in format \'email@email.service\'.');

				})
				.expect(400, done);

		});
	});
});
