/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

var request = require('supertest');
var server = require('../index.js');
var util = require('./utility.js');

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

//*******************************************************************
//Mock Input

var post_input = {
	"region": 3,
    "forest": 50552,
    "district": 50552,
    "authorizingOfficerName": "WILLIAM L.NOXON",
    "authorizingOfficerTitle": null,
    "applicant-info": {
      "firstName": "John",
      "lastName": "Doe",
      "dayPhone": {
        "areaCode": 541,
        "number": 8156141,
        "extension": 0,
        "type": "BUSINESS"
      },
      "emailAddress": "test@email.org",
      "mailingAddress": "ON ANW 0953",
      "mailingCity": "ALBANY",
      "mailingState": "OR",
      "mailingZIP": 97321
    },
    "noncommercial-fields": {
      "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
      "locationDescription": "string",
      "startDateTime": "2013-01-12",
      "endDateTime": "2013-01-19",
      "numberParticipants": 45
	}
};



//*******************************************************************

describe('noncommercial POST required noncommercial fields', function(){

	it('should return valid json with a 400 status code for noncommercial POST request without a body', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
	       	.expect('Content-Type', /json/)
            .expect(function(res){
                expect(res.body.response.message).to.equal('Body cannot be empty.');
            })
            .expect(400, done);
    });    

    it('should return valid json with a 400 status code for noncommercial POST request without a noncommercial-fields object', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	util.update_input_data(
            		post_input,
            		{
						"noncommercial-fields": null
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(function(res){
                expect(res.body.response.message).to.equal('noncommercial-fields cannot be empty.');
            })
            .expect(400, done);
    });
    
    it('should return valid json with a 400 status code for noncommercial POST request without an activityDescription', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	util.update_input_data(
            		post_input,
            		{
						"noncommercial-fields": {
							"locationDescription": "string",
							"startDateTime": "2013-01-12",
							"endDateTime": "2013-01-19",
							"numberParticipants": 45
						}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(function(res){
                expect(res.body.response.message).to.equal('activityDescription is a required field!');
            })
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a locationDescription', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	util.update_input_data(
            		post_input,
            		{
						"noncommercial-fields": {
							"activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
							"startDateTime": "2013-01-12",
							"endDateTime": "2013-01-19",
							"numberParticipants": 45
						}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(function(res){
                expect(res.body.response.message).to.equal('locationDescription is a required field!');
            })
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a startDateTime', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	util.update_input_data(
            		post_input,
            		{
						"noncommercial-fields": {
							"activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
							"locationDescription": "string",
							"endDateTime": "2013-01-19",
							"numberParticipants": 45
						}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(function(res){
                expect(res.body.response.message).to.equal('startDateTime is a required field!');
            })
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a endDateTime', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	util.update_input_data(
            		post_input,
            		{
						"noncommercial-fields": {
							"activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
							"locationDescription": "string",
							"startDateTime": "2013-01-12",
							"numberParticipants": 45
						}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(function(res){
                expect(res.body.response.message).to.equal('endDateTime is a required field!');
            })
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a numberParticipants', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	util.update_input_data(
            		post_input,
            		{
						"noncommercial-fields": {
							"activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
							"locationDescription": "string",
							"startDateTime": "2013-01-12",
							"endDateTime": "2013-01-19",
						}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(function(res){
                expect(res.body.response.message).to.equal('numberParticipants is a required field!');
            })
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for an invalid noncommercial POST request', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	util.update_input_data(
            		post_input,
            		{
						"noncommercial-fields": {
							"activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
							"locationDescription": "string",
							"startDateTime": "2013-01-12"
						}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(function(res){
                expect(res.body.response.message).to.equal('endDateTime and numberParticipants are required fields!');
            })
            .expect(400, done);
    });
});
