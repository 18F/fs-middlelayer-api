/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
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

const factory = require('unionized');

const noncommercialInput = include('test/data/testInputNoncommercial.json');
const testURL = '/permits/applications/special-uses/noncommercial/';

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************
//Mock Input

const noncommercialFactory = factory.factory(noncommercialInput);

//*******************************************************************

describe('noncommercial POST: validate required fields present', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('body fields', function(){

		it('should return valid json with a 400 status code for noncommercial POST request without a body', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Region is a required field. Forest is a required field. District is a required field. Applicant Info is a required field. Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Phone Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field. Type is a required field. Noncommercial Fields is a required field. Noncommercial Fields/Activity Description is a required field. Noncommercial Fields/Location Description is a required field. Noncommercial Fields/Start Date Time is a required field. Noncommercial Fields/End Date Time is a required field. Noncommercial Fields/Number Participants is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without an applicantInfo object', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({applicantInfo : undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){
					expect(res.body.response.message).to.equal('Applicant Info is a required field. Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Phone Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a noncommercialFields object', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({noncommercialFields : undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields is a required field. Noncommercial Fields/Activity Description is a required field. Noncommercial Fields/Location Description is a required field. Noncommercial Fields/Start Date Time is a required field. Noncommercial Fields/End Date Time is a required field. Noncommercial Fields/Number Participants is a required field.');

				})
				.expect(400, done);

		});

	}); 

	describe('applicantInfo fields', function(){

		it('should return valid json with a 400 status code for noncommercial POST request without a firstName', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.firstName':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a lastName', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.lastName':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Last Name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayphone', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Phone Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/areaCode', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.areaCode':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/number', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.number':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/phoneType', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.phoneType':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Phone Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without an emailAddress', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.emailAddress':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingAddress', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.mailingAddress':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingCity', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.mailingCity':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing City is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingState', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.mailingState':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing State is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingZIP', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.mailingZIP':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip is a required field.');

				})
				.expect(400, done);

		});
	});

	describe('noncommercial fields', function(){

		it('should return valid json with a 400 status code for noncommercial POST request without an activityDescription', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.activityDescription':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Activity Description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a locationDescription', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.locationDescription':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Location Description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a startDateTime', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.startDateTime':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Start Date Time is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a endDateTime', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.endDateTime':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/End Date Time is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a numberParticipants', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.numberParticipants':undefined}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Number Participants is a required field.');

				})
				.expect(400, done);

		});

	});

});

describe('API Routes: permits/special-uses/noncommercial', function(){
	
	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});
	
	it('should return valid json for noncommercial GET request for id', function(done) {

		request(server)
			.get(`${testURL}987654321/`)
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});
	
	it('should return valid json for noncommercial POST request', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create())
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

});

describe('noncommercial POST: field type validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('noncommercial POST: required fields are type validated', function(){

		it('should return valid json for invalid type, firstName', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.firstName':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, lastName', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.lastName':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Last Name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.areaCode', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.areaCode':'123'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.number', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.number':'456789'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.phoneType', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.phoneType':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Phone Type is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, emailAddress', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.emailAddress':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingAddress', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.mailingAddress':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingCity', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.mailingCity':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing City is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.mailingState':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing State is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingZIP', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.mailingZIP':12345}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, activityDescription', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.activityDescription':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Activity Description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, locationDescription', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.locationDescription':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Location Description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, startDateTime', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.startDateTime':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Start Date Time is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, endDateTime', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.endDateTime':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/End Date Time is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, numberParticipants', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'noncommercialFields.numberParticipants':'15'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Number Participants is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

	});

	describe('noncommercial POST: non-required fields are type validated', function(){

		it('should return valid json for invalid type, dayPhone.extension', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.extension':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Extension is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

	});

});

describe('noncommercial POST: format validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('noncommercial POST: fields with a specific format are validated', function(){

		it('should return valid json for invalid format, areaCode', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.areaCode':1}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code must be 3 digits.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid format, number', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.dayPhone.number':456789}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number must be 7 digits.');

				})
				.expect(400, done);

		});

	});

	it('should return valid json for invalid format, mailingState', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({'applicantInfo.mailingState':'ORE'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Applicant Info/Mailing State must be 2 letters.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, mailingZIP', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({'applicantInfo.mailingZIP':'123456'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip must be 5 or 9 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for valid format, mailingZIP', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({'applicantInfo.mailingZIP':'123456789'}))
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for invalid format, region', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({'region':'156'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Region must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, forest', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({'forest':'156'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Forest must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, district', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({'district':'156'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('District must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, startDateTime', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({'noncommercialFields.startDateTime':'01-12-2012'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Noncommercial Fields/Start Date Time must be in format \'YYYY-MM-DDThh:mm:ssZ\'.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, endDateTime', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({'noncommercialFields.endDateTime':'01-12-2012'}))
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Noncommercial Fields/End Date Time must be in format \'YYYY-MM-DDThh:mm:ssZ\'.');

			})
			.expect(400, done);

	});

});

describe('noncommercial POST: enum validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('noncommercial POST: fields with enumuration are validated', function(){

		it('should return valid json for invalid option, type', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'type':'invalid'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Type is not one of enum values: noncommercial,tempOutfitters.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid option, orgType', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.orgType':'invalid'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Org Type is not one of enum values: Individual,Corporation,Limited Liability Company,Partnership or Association,State Government or Agency,Local Government or Agency,Nonprofit.');

				})
				.expect(400, done);

		});

	});

});

describe('noncommercial POST: pattern validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('noncommercial POST: fields with a regex pattern are validated', function(){

		it('should return valid json for invalid pattern, emailAddress', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.emailAddress':'invalid'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address must be in format \'email@email.service\'.');

				})
				.expect(400, done);

		});
	});
});

describe('noncommercial POST: dependency validated', function(){

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});

	describe('noncommercial POST: fields with a dependency are validated', function(){

		it('should return valid json for organizationName being provided but not orgType', function(done) {

			request(server)
				.post(testURL)
				.set('x-access-token', token)
				.send(noncommercialFactory.create({'applicantInfo.organizationName':'theOrg'}))
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Having Applicant Info/Organization Name requires that Applicant Info/Org Type be provided.');

				})
				.expect(400, done);

		});
	});
});
