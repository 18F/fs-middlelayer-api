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
        "orgType": "Limited Liability Company"
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
};

var post_input_no_outfitters_field = {
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
        "orgType": "Limited Liability Company"
    },
    "type": "temp-outfitter-guide"
};



//*******************************************************************

describe('outfitters POST: required outfitters fields', function(){

    it('should return valid json with a 400 status code for outfitters POST request without a body', function(done) {
        
        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .expect('Content-Type', /json/)
            .expect(function(res){

                expect(res.body.response.message).to.equal('region and forest and district and applicant-info and type and temp-outfitter-fields are required fields!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for outfitters POST request without a temp-outfitter-fields object', function(done) {

        request(server)
            .post('/permits/special-uses/commercial/outfitters')
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

    it('should return valid json with a 400 status code for outfitters POST request without an orgType', function(done) {

        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
                util.update_input_data(
                    post_input,
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
                            "mailingState": "OR",
                            "mailingZIP": 97321
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

    it('should return valid json with a 400 status code for outfitters POST request without an activityDescription', function(done) {

        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "temp-outfitter-fields": {
                            "locationDescription": "string",
                            "startDateTime": "2013-01-12",
                            "endDateTime": "2013-01-19",
                            "insuranceCertificate":"File on S3",
                            "goodStandingEvidence":"File on S3",
                            "operatingPlan":"File on S3"
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
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "temp-outfitter-fields": {
                            "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                            "startDateTime": "2013-01-12",
                            "endDateTime": "2013-01-19",
                            "insuranceCertificate":"File on S3",
                            "goodStandingEvidence":"File on S3",
                            "operatingPlan":"File on S3"
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
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "temp-outfitter-fields": {
                            "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                            "locationDescription": "string",
                            "endDateTime": "2013-01-19",
                            "insuranceCertificate":"File on S3",
                            "goodStandingEvidence":"File on S3",
                            "operatingPlan":"File on S3"
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
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "temp-outfitter-fields": {
                            "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                            "locationDescription": "string",
                            "startDateTime": "2013-01-12",
                            "insuranceCertificate":"File on S3",
                            "goodStandingEvidence":"File on S3",
                            "operatingPlan":"File on S3"
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
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "temp-outfitter-fields": {
                            "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                            "locationDescription": "string",
                            "startDateTime": "2013-01-12",
                            "endDateTime": "2013-01-19",
                            "goodStandingEvidence":"File on S3",
                            "operatingPlan":"File on S3"
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
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "temp-outfitter-fields": {
                            "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                            "locationDescription": "string",
                            "startDateTime": "2013-01-12",
                            "endDateTime": "2013-01-19",
                            "insuranceCertificate":"File on S3",
                            "operatingPlan":"File on S3"
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
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "temp-outfitter-fields": {
                            "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                            "locationDescription": "string",
                            "startDateTime": "2013-01-12",
                            "endDateTime": "2013-01-19",
                            "insuranceCertificate":"File on S3",
                            "goodStandingEvidence":"File on S3"
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

    it('should return valid json with a 400 status code for an invalid outfitters POST request', function(done) {

        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "temp-outfitter-fields": {
                            "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                            "locationDescription": "string",
                            "startDateTime": "2013-01-12",
                            "endDateTime": "2013-01-19",
                            "operatingPlan":"File on S3"
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
            .send(
                util.update_input_data(
                    post_input_no_outfitters_field,
                    {
                        "region": 3,
                        "forest": 50552,
                        "district": 50552,
                        "authorizingOfficerName": "WILLIAM L.NOXON",
                        "authorizingOfficerTitle": "null",
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
                        },
                        "type": "temp-outfitter-guide"
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
