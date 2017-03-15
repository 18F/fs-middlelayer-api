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
const server = include('index.js');
const util = include('test/utility.js');

const testInput = include('test/data/testInputNoncommercial.json');

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************
//Mock Input

const postInput = testInput.postInput;
const postInputNoNoncommercialField = testInput.noNoncommercialField;
const postInputNoncommercialNoApplicantInfo = testInput.noApplicantInfoField;

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
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Region is a required field. Forest is a required field. District is a required field. Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field. Type is a required field. Noncommercial Fields/Activity Description is a required field. Noncommercial Fields/Location Description is a required field. Noncommercial Fields/Start Date Time is a required field. Noncommercial Fields/End Date Time is a required field. Noncommercial Fields/Number Participants is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without an applicantInfo object', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInputNoncommercialNoApplicantInfo,
						{}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a noncommercialFields object', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInputNoNoncommercialField,
						{}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Activity Description is a required field. Noncommercial Fields/Location Description is a required field. Noncommercial Fields/Start Date Time is a required field. Noncommercial Fields/End Date Time is a required field. Noncommercial Fields/Number Participants is a required field.');

				})
				.expect(400, done);

		});

	}); 

	describe('applicantInfo fields', function(){

		it('should return valid json with a 400 status code for noncommercial POST request without a firstName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 541,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a lastName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'dayPhone': {
									'areaCode': 541,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Last Name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayphone', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/areaCode', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'dayPhone': {
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 541,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/type', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 541,
									'number': 8156141,
									'extension': 0
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without an emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
					postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 541,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
					postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 541,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingCity', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 541,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing City is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingState', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 541,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing State is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingZIP', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName': 'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 541,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR'
							}
						}
					)
				)
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
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
					postInput,
						{
							'noncommercialFields': {
								'locationDescription': 'string',
								'startDateTime': '2013-01-12T12:00:00Z',
								'endDateTime': '2013-01-19T12:00:00Z',
								'numberParticipants': 45
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Activity Description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a locationDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'noncommercialFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'startDateTime': '2013-01-12T12:00:00Z',
								'endDateTime': '2013-01-19T12:00:00Z',
								'numberParticipants': 45
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Location Description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a startDateTime', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'noncommercialFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'endDateTime': '2013-01-19T12:00:00Z',
								'numberParticipants': 45
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Start Date Time is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a endDateTime', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'noncommercialFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12T12:00:00Z',
								'numberParticipants': 45
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/End Date Time is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a numberParticipants', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'noncommercialFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12T12:00:00Z',
								'endDateTime': '2013-01-19T12:00:00Z'
							}
						}
					)
				)
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
			.get('/permits/applications/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});
 
	it('should return valid json for noncommercial PUT request for id', function(done) {

		request(server)
			.put('/permits/applications/special-uses/noncommercial/1234')
			.set('x-access-token', token)
			.send(postInput)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});
	
	it('should return valid json for noncommercial POST request', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(postInput)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for noncommercial POST request with apiRequest', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(postInput)
			.expect('Content-Type', /json/)
			.expect(function(res){
				expect(res.body).to.have.property('apiRequest');
			})	
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
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':123,
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/First Name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, lastName', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 123,
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Last Name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.areaCode', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': '541',
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': '8156141',
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.type', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 1
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Type is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 1,
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 1,
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingCity', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 1,
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing City is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 1,
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing State is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': '97321'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, activityDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercialFields': {
									'activityDescription': 1,
									'locationDescription': 'string',
									'startDateTime': '2013-01-12T12:00:00Z',
									'endDateTime': '2013-01-19T12:00:00Z',
									'numberParticipants': 45
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Activity Description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, locationDescription', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercialFields': {
									'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
									'locationDescription': 1,
									'startDateTime': '2013-01-12T12:00:00Z',
									'endDateTime': '2013-01-19T12:00:00Z',
									'numberParticipants': 45
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Location Description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, startDateTime', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercialFields': {
									'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
									'locationDescription': 'string',
									'startDateTime': 1,
									'endDateTime': '2013-01-19T12:00:00Z',
									'numberParticipants': 45
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/Start Date Time is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, endDateTime', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercialFields': {
									'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
									'locationDescription': 'string',
									'startDateTime': '2013-01-12T12:00:00Z',
									'endDateTime': 123,
									'numberParticipants': 45
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Noncommercial Fields/End Date Time is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, numberParticipants', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercialFields': {
									'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
									'locationDescription': 'string',
									'startDateTime': '2013-01-12T12:00:00Z',
									'endDateTime': '2013-01-19T12:00:00Z',
									'numberParticipants': '45'
								}
							}
						)
					)
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
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': '0',
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Extension is expected to be type \'integer\'.');

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
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 1,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Area Code must be 3 digits.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid format, number', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 123,
										'number': 816141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Day Phone/Number must be 7 digits.');

				})
				.expect(400, done);

		});

	});

	it('should return valid json for invalid format, mailingState', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName':'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 123,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'ORE',
								'mailingZIP': 97321
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Applicant Info/Mailing State must be 2 letters.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, mailingZIP', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName':'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 123,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 3123
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Applicant Info/Mailing Zip must be 5 or 9 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for valid format, mailingZIP', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'applicantInfo': {
								'firstName':'John',
								'lastName': 'Doe',
								'dayPhone': {
									'areaCode': 123,
									'number': 8156141,
									'extension': 0,
									'type': 'BUSINESS'
								},
								'emailAddress': 'test@email.org',
								'mailingAddress': 'ON ANW 0953',
								'mailingCity': 'ALBANY',
								'mailingState': 'OR',
								'mailingZIP': 312311234
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for invalid format, region', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'region': 313,
							'forest': 50,
							'district': 50
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Region must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, forest', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'region': 33,
							'forest': 510,
							'district': 50
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Forest must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, district', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'region': 31,
							'forest': 50,
							'district': 510
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('District must be 2 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, startDateTime', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'noncommercialFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '01-12-2014T12:00:00Z',
								'endDateTime': '2013-01-19T12:00:00Z',
								'numberParticipants': 45
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Noncommercial Fields/Start Date Time must be in format \'YYYY-MM-DDThh:mm:ssZ\'.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, endDateTime', function(done) {

		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'noncommercialFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12T12:00:00Z',
								'endDateTime': '01-19-2016T12:00:00Z',
								'numberParticipants': 45
							}
						}
					)
				)
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
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'type':'invalid'
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Type is not one of enum values: noncommercial,tempOutfitterGuide.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid option, orgType', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 541,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'test@email.org',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321,
									'orgType': 'invalid'
								}
							}
						)
					)
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

	describe('noncommercial POST: fields with a regex pattern are validated', function(){

		it('should return valid json for invalid pattern, emailAddress', function(done) {

			request(server)
				.post('/permits/applications/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicantInfo': {
									'firstName':'John',
									'lastName': 'Doe',
									'dayPhone': {
										'areaCode': 123,
										'number': 8156141,
										'extension': 0,
										'type': 'BUSINESS'
									},
									'emailAddress': 'invalid',
									'mailingAddress': 'ON ANW 0953',
									'mailingCity': 'ALBANY',
									'mailingState': 'OR',
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant Info/Email Address must be in format \'email@email.service\'.');

				})
				.expect(400, done);

		});
	});
});
