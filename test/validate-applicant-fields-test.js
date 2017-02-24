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

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

//*******************************************************************

describe('noncommercial POST required applicant-info fields',function(){

	it('should return valid json with a 400 status code for noncommercial POST request without an applicant-info object', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData({
	           	"applicant-info": null
        		})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a firstName', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData({
	            	"applicant-info": {
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
            		}
        		})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a lastName', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData({
	            	"applicant-info": {
	      				"firstName": "John",
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
            		}
        		})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a dayphone', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData({
	            	"applicant-info": {
	      				"firstName": "John",
	      				"lastName": "Doe",
						"emailAddress": "test@email.org",
						"mailingAddress": "ON ANW 0953",
						"mailingCity": "ALBANY",
						"mailingState": "OR",
						"mailingZIP": 97321
					}
        		})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/areaCode', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData({
	            	"applicant-info": {
	      				"firstName": "John",
	      				"lastName": "Doe",
						"dayPhone": {
							"number": 8156141,
							"extension": 0,
							"type": "BUSINESS"
      					},
						"emailAddress": "test@email.org",
						"mailingAddress": "ON ANW 0953",
						"mailingCity": "ALBANY",
						"mailingState": "OR",
						"mailingZIP": 97321
            		}
	        	})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/number', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData(
            		{
		            	"applicant-info": {
		      				"firstName": "John",
		      				"lastName": "Doe",
							"dayPhone": {
								"areaCode": 541,
								"extension": 0,
								"type": "BUSINESS"
	      					},
							"emailAddress": "test@email.org",
							"mailingAddress": "ON ANW 0953",
							"mailingCity": "ALBANY",
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/type', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData(
            		{
		            	"applicant-info": {
		      				"firstName": "John",
		      				"lastName": "Doe",
							"dayPhone": {
								"areaCode": 541,
								"number": 8156141,
								"extension": 0,
	      					},
							"emailAddress": "test@email.org",
							"mailingAddress": "ON ANW 0953",
							"mailingCity": "ALBANY",
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without an emailAddress', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData(
            		{
		            	"applicant-info": {
		      				"firstName": "John",
		      				"lastName": "Doe",
							"dayPhone": {
								"areaCode": 541,
								"number": 8156141,
								"extension": 0,
								"type": "BUSINESS"
	      					},
							"mailingAddress": "ON ANW 0953",
							"mailingCity": "ALBANY",
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a mailingAddress', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData(
            		{
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
							"mailingCity": "ALBANY",
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a mailingCity', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData(
            		{
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
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a mailingState', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData(
            		{
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
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for noncommercial POST request without a mailingZIP', function(done) {
        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
            	updateInputData(
            		{
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
							"mailingState": "OR"
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });
});

//*******************************************************************
//*******************************************************************

describe('outfitters POST required applicant-info fields',function(){

	it('should return valid json with a 400 status code for outfitters POST request without an applicant-info object', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData({
	           	"applicant-info": null
        		})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a firstName', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData({
	            	"applicant-info": {
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
            		}
        		})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a lastName', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData({
	            	"applicant-info": {
	      				"firstName": "John",
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
            		}
        		})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a dayphone', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData({
	            	"applicant-info": {
	      				"firstName": "John",
	      				"lastName": "Doe",
						"emailAddress": "test@email.org",
						"mailingAddress": "ON ANW 0953",
						"mailingCity": "ALBANY",
						"mailingState": "OR",
						"mailingZIP": 97321
					}
        		})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/areaCode', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData({
	            	"applicant-info": {
	      				"firstName": "John",
	      				"lastName": "Doe",
						"dayPhone": {
							"number": 8156141,
							"extension": 0,
							"type": "BUSINESS"
      					},
						"emailAddress": "test@email.org",
						"mailingAddress": "ON ANW 0953",
						"mailingCity": "ALBANY",
						"mailingState": "OR",
						"mailingZIP": 97321
            		}
	        	})
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/number', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData(
            		{
		            	"applicant-info": {
		      				"firstName": "John",
		      				"lastName": "Doe",
							"dayPhone": {
								"areaCode": 541,
								"extension": 0,
								"type": "BUSINESS"
	      					},
							"emailAddress": "test@email.org",
							"mailingAddress": "ON ANW 0953",
							"mailingCity": "ALBANY",
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a dayPhone/type', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData(
            		{
		            	"applicant-info": {
		      				"firstName": "John",
		      				"lastName": "Doe",
							"dayPhone": {
								"areaCode": 541,
								"number": 8156141,
								"extension": 0,
	      					},
							"emailAddress": "test@email.org",
							"mailingAddress": "ON ANW 0953",
							"mailingCity": "ALBANY",
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without an emailAddress', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData(
            		{
		            	"applicant-info": {
		      				"firstName": "John",
		      				"lastName": "Doe",
							"dayPhone": {
								"areaCode": 541,
								"number": 8156141,
								"extension": 0,
								"type": "BUSINESS"
	      					},
							"mailingAddress": "ON ANW 0953",
							"mailingCity": "ALBANY",
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a mailingAddress', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData(
            		{
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
							"mailingCity": "ALBANY",
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a mailingCity', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData(
            		{
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
							"mailingState": "OR",
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a mailingState', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData(
            		{
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
							"mailingZIP": 97321
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters POST request without a mailingZIP', function(done) {
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
            	updateInputData(
            		{
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
							"mailingState": "OR"
	            		}
	        		}
	        	)
    		)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });
});

function updateInputData(update){
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

	var updated_input = Object.assign(
		{},
		post_input,
    	update
	);
	
	return updated_input;
}