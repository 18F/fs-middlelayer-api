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

const test_input = include('test/data/test_input_outfitters.json');

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************
//Mock Input

const post_input = test_input.post_input;
const post_input_no_outfitters_field = test_input.no_outfitters_field;
const post_input_no_applicant_info = test_input.no_applicant_info_field;

//*******************************************************************

describe('outfitters POST: validate required fields present', function(){

	let token;

	before(function(done) {

		util.get_token(function(t){

			token = t;
			return done();

		});
	
	});

	describe('validate required fields present: body fields', function(){

		it('should return valid json with a 400 status code for outfitters POST request without a body', function(done) {
		
			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('region and forest and district and applicant-info and type and temp-outfitter-fields are required fields!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an applicant-info object', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input_no_applicant_info,
						{}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('applicant-info is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a temp-outfitter-fields object', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input_no_outfitters_field,
						{}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('temp-outfitter-fields is a required field!');

				})
				.expect(400, done);

		});

	});

	describe('validate required fields present: applicant-info fields', function(){

		it('should return valid json with a 400 status code for outfitters POST request without a firstName', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without a lastName', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
						{
							'applicant-info': {
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

					expect(res.body.response.message).to.equal('applicant-info.dayPhone is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/areaCode', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/number', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/type', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without an emailAddress', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without a mailingAddress', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without a mailingCity', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without a mailingState', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingZIP': 97321,
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without a mailingZIP', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingState': 'OR',
								'orgType':'Limited Liability Company'
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

		it('should return valid json with a 400 status code for outfitters POST request without an orgType', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
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
								'mailingState': 'OR',
								'mailingZIP': 97321
							}
						}
					)
				)
				.expect('Content-Type', /json/)
				.expect(function(res){

					expect(res.body.response.message).to.equal('applicant-info.orgType is a required field!');

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
					util.update_input_data(
						post_input,
						{
							'temp-outfitter-fields': {
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

					expect(res.body.response.message).to.equal('temp-outfitter-fields.activityDescription is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a locationDescription', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
						{
							'temp-outfitter-fields': {
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

					expect(res.body.response.message).to.equal('temp-outfitter-fields.locationDescription is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without a startDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
						{
							'temp-outfitter-fields': {
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

					expect(res.body.response.message).to.equal('temp-outfitter-fields.startDateTime is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an endDateTime', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
						{
							'temp-outfitter-fields': {
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

					expect(res.body.response.message).to.equal('temp-outfitter-fields.endDateTime is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an insuranceCertificate', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
						{
							'temp-outfitter-fields': {
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

					expect(res.body.response.message).to.equal('temp-outfitter-fields.insuranceCertificate is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an goodStandingEvidence', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
						{
							'temp-outfitter-fields': {
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

					expect(res.body.response.message).to.equal('temp-outfitter-fields.goodStandingEvidence is a required field!');

				})
				.expect(400, done);

		});

		it('should return valid json with a 400 status code for outfitters POST request without an operatingPlan', function(done) {

			request(server)
				.post('/permits/special-uses/commercial/outfitters')
				.set('x-access-token', token)
				.send(
					util.update_input_data(
						post_input,
						{
							'temp-outfitter-fields': {
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

					expect(res.body.response.message).to.equal('temp-outfitter-fields.operatingPlan is a required field!');

				})
				.expect(400, done);

		});

	});

});

describe('outfitters POST: required outfitters fields', function(){

	let token;

	before(function(done) {

		util.get_token(function(t){

			token = t;
			return done();

		});
	
	});

	it('should return valid json with a 400 status code for an invalid outfitters POST request', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters')
			.set('x-access-token', token)
			.send(
				util.update_input_data(
					post_input,
					{
						'temp-outfitter-fields': {
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

				expect(res.body.response.message).to.equal('temp-outfitter-fields.insuranceCertificate and temp-outfitter-fields.goodStandingEvidence are required fields!');

			})
			.expect(400, done);

	});

	it('should return valid json with all errors reported during validation', function(done){

		request(server)
			.post('/permits/special-uses/commercial/outfitters')
			.set('x-access-token', token)
			.send(
				util.update_input_data(
					post_input_no_outfitters_field,
					{
						'region': 3,
						'forest': 50552,
						'district': 50552,
						'authorizingOfficerName': 'WILLIAM L.NOXON',
						'authorizingOfficerTitle': 'null',
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
						},
						'type': 'temp-outfitter-guide'
					}
				)
			)
			.expect('Content-Type', /json/)
			.expect(function(res){

				expect(res.body.response.message).to.equal('applicant-info.firstName and applicant-info.orgType and temp-outfitter-fields are required fields!');

			})
			.expect(400, done);
	
	});

});

describe('API Routes: permits/special-uses/commercial/outfitters', function() {
	
	let token;

	before(function(done) {

		util.get_token(function(t){

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
			.send(post_input)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json for outfitters POST request with apiRequest', function(done) {

		request(server)
			.post('/permits/special-uses/commercial/outfitters')
			.set('x-access-token', token)
			.send(post_input)
			.expect('Content-Type', /json/)
			.expect(function(res){
				expect(res.body).to.have.property('apiRequest');
			})	
			.expect(200, done);

	});

});
