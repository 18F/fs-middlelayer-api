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

const testInput = include('test/data/testInputOutfitters.json');

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************
//Mock Input

const postInput = testInput.postInput;
const postInputNoOutfittersField = testInput.noOutfittersField;
const postInputNoApplicantInfo = testInput.noApplicantInfoField;

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
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Region is a required field. Forest is a required field. District is a required field. Applicant info is a required field. Type is a required field. Temp outfitter fields is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an applicantInfo object', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInputNoApplicantInfo,
						{}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Applicant info is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a tempOutfitterFields object', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInputNoOutfittersField,
						{}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Temp outfitter fields is a required field.');

				})
				.expect(400, done);

		});

	});

	describe('applicantInfo fields', function(){

		it('should return valid json with a 400 status code for outfitters POST request without a firstName', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('First name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a lastName', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Last name is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Day phone is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/areaCode', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Area code is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/number', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Number is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/type', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Type is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an emailAddress', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Email address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a mailingAddress', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Mailing address is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a mailingCity', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Mailing city is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a mailingState', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Mailing state is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a mailingZIP', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingState': 'OR',
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Mailing zip is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an orgType', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
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
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Org type is a required field.');

				})
				.expect(400, done);

		});

	});

	describe('validate required fields present: outfitters fields', function(){

		it('should return valid json with a 400 status code for outfitters POST request without an activityDescription', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19',
								'insuranceCertificate':'File on S3',
								'goodStandingEvidence':'File on S3',
								'operatingPlan':'File on S3'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Activity description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a locationDescription', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19',
								'insuranceCertificate':'File on S3',
								'goodStandingEvidence':'File on S3',
								'operatingPlan':'File on S3'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Location description is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a startDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'endDateTime': '2013-01-19',
								'insuranceCertificate':'File on S3',
								'goodStandingEvidence':'File on S3',
								'operatingPlan':'File on S3'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Start date time is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an endDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'insuranceCertificate':'File on S3',
								'goodStandingEvidence':'File on S3',
								'operatingPlan':'File on S3'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('End date time is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an insuranceCertificate', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19',
								'goodStandingEvidence':'File on S3',
								'operatingPlan':'File on S3'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Insurance certificate is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an goodStandingEvidence', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19',
								'insuranceCertificate':'File on S3',
								'operatingPlan':'File on S3'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Good standing evidence is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an operatingPlan', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19',
								'insuranceCertificate':'File on S3',
								'goodStandingEvidence':'File on S3'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Operating plan is a required field.');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for an invalid outfitters POST request', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'endDateTime': '2013-01-19',
								'operatingPlan':'File on S3'
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Insurance certificate is a required field. Good standing evidence is a required field.');

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
			.get('/permits/special-uses/commercial/outfitters/1234567890')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for outfitters PUT request for id', function(done) {

		request(server)
			.put('/permits/special-uses/commercial/outfitters/1234')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});
	
	it('should return valid json for outfitters POST request', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters')
			.set('x-access-token', token)
			.send(postInput)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for outfitters POST request with apiRequest', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters')
			.set('x-access-token', token)
			.send(postInput)
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
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('First name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, lastName', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Last name is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, areaCode', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Area code is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, number', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Number is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, type', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Type is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, emailAddress', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Email address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingAddress', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Mailing address is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingCity', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Mailing city is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Mailing state is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, mailingState', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': '97321',
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Mailing zip is expected to be type \'integer\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, activityDescription', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'tempOutfitterFields': {
									'activityDescription': 1,
									'locationDescription': 'string',
									'startDateTime': '2013-01-12',
									'endDateTime': '2013-01-19',
									'insuranceCertificate': 'insurance',
									'goodStandingEvidence': 'standing',
									'operatingPlan': 'operating'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Activity description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, locationDescription', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'tempOutfitterFields': {
									'activityDescription': 'string',
									'locationDescription': 1,
									'startDateTime': '2013-01-12',
									'endDateTime': '2013-01-19',
									'insuranceCertificate': 'insurance',
									'goodStandingEvidence': 'standing',
									'operatingPlan': 'operating'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Location description is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, startDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'tempOutfitterFields': {
									'activityDescription': 'string',
									'locationDescription': 'string',
									'startDateTime': 1,
									'endDateTime': '2013-01-19',
									'insuranceCertificate': 'insurance',
									'goodStandingEvidence': 'standing',
									'operatingPlan': 'operating'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Start date time is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid type, endDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
				.set('x-access-token', token)
				.send(
						util.updateInputData(
							postInput,
							{
								'tempOutfitterFields': {
									'activityDescription': 'string',
									'locationDescription': 'string',
									'startDateTime': '2013-01-12',
									'endDateTime': 1,
									'insuranceCertificate': 'insurance',
									'goodStandingEvidence': 'standing',
									'operatingPlan': 'operating'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('End date time is expected to be type \'string\'.');

				})
				.expect(400, done);

		});

	});

	describe('noncommercial POST: non-required fields are type validated', function(){

		it('should return valid json for invalid type, extension', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Extension is expected to be type \'integer\'.');

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
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Area code must be 3 digits.');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid format, number', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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
									'mailingZIP': 97321,
									'orgType':'Limited Liability Company'
								}
							}
						)
					)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('Number must be 7 digits.');

				})
				.expect(400, done);

		});

	});

	it('should return valid json for invalid format, mailingState', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters/')
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Mailing state must be 2 letters.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, mailingZIP', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters/')
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
								'mailingZIP': 3123,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Mailing zip must be 5 or 9 digits.');

			})
			.expect(400, done);

	});

	it('should return valid json for valid format, mailingZIP', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters/')
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
								'mailingZIP': 312311234,
								'orgType':'Limited Liability Company'
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for invalid format, region', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters/')
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
			.post('/permits/special-uses/commercial/outfitters/')
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
			.post('/permits/special-uses/commercial/outfitters/')
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
			.post('/permits/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'string',
								'locationDescription': 'string',
								'startDateTime': '01-12-2013',
								'endDateTime': '2013-01-19',
								'insuranceCertificate': 'insurance',
								'goodStandingEvidence': 'standing',
								'operatingPlan': 'operating'
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('Start date time must be in format \'YYYY-MM-DD\'.');

			})
			.expect(400, done);

	});

	it('should return valid json for invalid format, endDateTime', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters/')
			.set('x-access-token', token)
			.send(
					util.updateInputData(
						postInput,
						{
							'tempOutfitterFields': {
								'activityDescription': 'string',
								'locationDescription': 'string',
								'startDateTime': '2013-01-12',
								'endDateTime': '01-19-2013',
								'insuranceCertificate': 'insurance',
								'goodStandingEvidence': 'standing',
								'operatingPlan': 'operating'
							}
						}
					)
				)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('End date time must be in format \'YYYY-MM-DD\'.');

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
				.post('/permits/special-uses/commercial/outfitters/')
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

					expect(res.body.response.message).to.equal('Type is not one of enum values: noncommercial,tempOutfitterGuide');

				})
				.expect(400, done);

		});

		it('should return valid json for invalid option, orgType', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters/')
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

					expect(res.body.response.message).to.equal('Org type is not one of enum values: Individual,Corporation,Limited Liability Company,Partnership or Association,State Government or Agency,Local Government or Agency,Nonprofit');

				})
				.expect(400, done);

		});

	});

});
