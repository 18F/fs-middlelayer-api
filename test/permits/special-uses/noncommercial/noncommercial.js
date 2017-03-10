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

const testInput = include('test/data/test_input_noncommercial.json');

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************
//Mock Input

const postInput = testInput.post_input;
const postInputNoNoncommercialField = testInput.no_noncommercial_field;
const postInputNoncommercialNoApplicantInfo = testInput.no_applicant_info_field;

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
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('region and forest and district and applicant-info and type and noncommercial-fields are required fields!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without an applicant-info object', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInputNoncommercialNoApplicantInfo,
						{}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('applicant-info is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a noncommercial-fields object', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInputNoNoncommercialField,
						{}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields is a required field!');

				})
				.expect(400, done);

		});

	}); 

	describe('applicant-info fields', function(){

		it('should return valid json with a 400 status code for noncommercial POST request without a firstName', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.firstName is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a lastName', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.lastName is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayphone', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/areaCode', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone.areaCode is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/number', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone.number is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/type', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone.type is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without an emailAddress', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
					postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.emailAddress is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingAddress', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
					postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.mailingAddress is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingCity', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.mailingCity is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingState', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.mailingState is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a mailingZIP', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.mailingZIP is a required field!');

				})
				.expect(400, done);

		});
	});

	describe('noncommercial fields', function(){

		it('should return valid json with a 400 status code for noncommercial POST request without an activityDescription', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
					postInput,
						{
							'noncommercial-fields': {
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19',
								'numberParticipants': 45
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.activityDescription is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a locationDescription', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'noncommercial-fields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19',
								'numberParticipants': 45
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.locationDescription is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a startDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'noncommercial-fields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'endDateTime': '2013-01-19',
								'numberParticipants': 45
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.startDateTime is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a endDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'noncommercial-fields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'numberParticipants': 45
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.endDateTime is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for noncommercial POST request without a numberParticipants', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'noncommercial-fields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.numberParticipants is a required field!');

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
			.get('/permits/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});
 
	it('should return valid json for noncommercial PUT request for id', function(done) {

		request(server)
			.put('/permits/special-uses/noncommercial/1234')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});
	
	it('should return valid json for noncommercial POST request', function(done) {

		request(server)
			.post('/permits/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(postInput)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for noncommercial POST request with apiRequest', function(done) {

		request(server)
			.post('/permits/special-uses/noncommercial/')
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

	describe('noncommercial POST: required fileds are type validated', function(){

		it('should return valid json for invalid type, firstName', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.firstName is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, lastName', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.lastName is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.areaCode', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone.areaCode is expected to be type \'integer\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.number', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone.number is expected to be type \'integer\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, dayPhone.type', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone.type is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, emailAddress', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.emailAddress is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingAddress', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.mailingAddress is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingCity', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.mailingCity is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.mailingState is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.mailingZIP is expected to be type \'integer\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, activityDescription', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercial-fields': {
									'activityDescription': 1,
									'locationDescription': 'string',
									'startDateTime': '2013-01-12',
									'endDateTime': '2013-01-19',
									'numberParticipants': 45
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.activityDescription is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, locationDescription', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercial-fields': {
									'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
									'locationDescription': 1,
									'startDateTime': '2013-01-12',
									'endDateTime': '2013-01-19',
									'numberParticipants': 45
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.locationDescription is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, startDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercial-fields': {
									'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
									'locationDescription': 'string',
									'startDateTime': 1,
									'endDateTime': '2013-01-19',
									'numberParticipants': 45
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.startDateTime is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, endDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercial-fields': {
									'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
									'locationDescription': 'string',
									'startDateTime': '2013-01-12',
									'endDateTime': 123,
									'numberParticipants': 45
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.endDateTime is expected to be type \'string\'. ');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, numberParticipants', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'noncommercial-fields': {
									'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
									'locationDescription': 'string',
									'startDateTime': '2013-01-12',
									'endDateTime': '2013-01-19',
									'numberParticipants': '45'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('noncommercial-fields.numberParticipants is expected to be type \'integer\'. ');

				})
				.expect(400, done);

		});

	});

	describe('noncommercial POST: non-required fileds are type validated', function(){

		it('should return valid json for invalid type, dayPhone.extension', function(done) {

			request(server)
				.post('/permits/special-uses/noncommercial/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone.extension is expected to be type \'integer\'. ');

				})
				.expect(400, done);

		});

	});

});

