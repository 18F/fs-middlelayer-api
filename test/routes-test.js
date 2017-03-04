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

describe('API Routes: permits/special-uses/non-commercial', function() {
    
    it('should return valid json for non commercial GET request for all', function(done) {

        request(server)
            .get('/permits/special-uses/noncommercial')
            .expect('Content-Type', /json/)
            .expect(200, done);

    });
    
    it('should return valid json for non commercial GET request for id', function(done) {

        request(server)
            .get('/permits/special-uses/noncommercial/1234567890')
            .expect('Content-Type', /json/)
            .expect(200, done);

    });
 
    it('should return valid json for non commercial PUT request for id', function(done) {

        request(server)
            .put('/permits/special-uses/noncommercial/1234')
            .expect('Content-Type', /json/)
            .expect(200, done);

    });
    
    it('should return valid json for non commercial POST request', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial/')
            .send({
                "region": 3,
                "forest": 50552,
                "district": 50552,
                "authorizingOfficerName": "WILLIAM L.NOXON",
                "authorizingOfficerTitle": "null",
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
                    "mailingZIP": 97321,
                },
                "type": "noncommercial",
                "noncommercial-fields": {
                    "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                    "locationDescription": "string",
                    "startDateTime": "2013-01-12",
                    "endDateTime": "2013-01-19",
                    "numberParticipants": 45
                }
            })
            .expect('Content-Type', /json/)
            .expect(200, done);

    });

});

describe('API Routes: permits/special-uses/commercial/outfitters', function() {
    
    it('should return valid json for outfitters GET request for all', function(done) {

        request(server)
            .get('/permits/special-uses/commercial/outfitters')
            .expect('Content-Type', /json/)
            .expect(200, done);

    });
    
    it('should return valid json for outfitters GET request for id', function(done) {

        request(server)
            .get('/permits/special-uses/commercial/outfitters/1234567890')
            .expect('Content-Type', /json/)
            .expect(200, done);

    });

    it('should return valid json for outfitters PUT request for id', function(done) {

        request(server)
            .put('/permits/special-uses/commercial/outfitters/1234')
            .expect('Content-Type', /json/)
            .expect(200, done);

    });
    
    it('should return valid json for outfitters POST request', function(done) {

        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send({
                "region": 3,
                "forest": 50552,
                "district": 50552,
                "authorizingOfficerName": "WILLIAM L.NOXON",
                "authorizingOfficerTitle": "null",
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
                    "mailingZIP": 97321,
                    "orgType":"Limited Liability Company"
                },
                "type": "temp-outfitter-guide",
                "temp-outfitter-fields": {
                    "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                    "locationDescription": "string",
                    "startDateTime": "2013-01-12",
                    "endDateTime": "2013-01-19",
                    "insuranceCertificate":"File on S3",
                    "goodStandingEvidence":"File on S3",
                    "operatingPlan":"File on S3"
                }
            })
            .expect('Content-Type', /json/)
            .expect(200, done);

    });

});

describe('API Routes: permits/special-uses/commercial', function() {
    
    it('should return valid json for commercial GET request for all', function(done) {

        request(server)
            .get('/permits/special-uses/commercial')
            .expect('Content-Type', /json/)
            .expect(200, done);

    });

});

describe('API Routes: permits/special-uses', function() {
    
    it('should return valid json for special-uses GET request for all', function(done) {

        request(server)
            .get('/permits/special-uses')
            .expect('Content-Type', /json/)
            .expect(200, done);

    });

});


//*******************************************************************
