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
// Mock input

var post_input_noncommercial = {
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
        "mailingZIP": 97321
    },
    "type": "noncommercial",
    "noncommercial-fields": {
        "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
        "locationDescription": "string",
        "startDateTime": "2013-01-12",
        "endDateTime": "2013-01-19",
        "numberParticipants": 45
    }
};

var post_input_noncommercial_no_applicant_info = {
    "region": 3,
    "forest": 50552,
    "district": 50552,
    "authorizingOfficerName": "WILLIAM L.NOXON",
    "authorizingOfficerTitle": "null",
    "type": "noncommercial",
    "noncommercial-fields": {
        "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
        "locationDescription": "string",
        "startDateTime": "2013-01-12",
        "endDateTime": "2013-01-19",
        "numberParticipants": 45
    }
};

var post_input_outfitters = {
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
};

var post_input_outfitters_no_applicant_info = {
    "region": 3,
    "forest": 50552,
    "district": 50552,
    "authorizingOfficerName": "WILLIAM L.NOXON",
    "authorizingOfficerTitle": null,
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

//*******************************************************************

describe('noncommercial POST required applicant-info fields',function(){

    it('should return valid json with a 400 status code for noncommercial POST request without an applicant-info object', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                    post_input_noncommercial_no_applicant_info,
                    {}
                )
            )
            .expect('Content-Type', /json/)
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a firstName', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                    post_input_noncommercial,
                    {
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
            .send(
                util.update_input_data(
                    post_input_noncommercial,
                    {
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
            .send(
                util.update_input_data(
                    post_input_noncommercial,
                    {
                        "applicant-info": {
                            "firstName": "John",
                            "lastName": "Doe",
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

            	expect(res.body.response.message).to.equal('applicant-info.dayPhone is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/areaCode', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                    post_input_noncommercial,
                    {
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
            .send(
                util.update_input_data(
                    post_input_noncommercial,
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
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info.dayPhone.number is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a dayPhone/type', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                    post_input_noncommercial,
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
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info.dayPhone.type is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without an emailAddress', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                post_input_noncommercial,
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
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info.emailAddress is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a mailingAddress', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                post_input_noncommercial,
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
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info.mailingAddress is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a mailingCity', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                    post_input_noncommercial,
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
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info.mailingCity is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a mailingState', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                    post_input_noncommercial,
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
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info.mailingState is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a mailingZIP', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                    post_input_noncommercial,
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
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info.mailingZIP is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request with all invalid fields listed', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .send(
                util.update_input_data(
                    post_input_noncommercial,
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
                            "mailingAddress": "ON ANW 0953"
                        }
                    }
                )
            )
            .expect('Content-Type', /json/)
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info.mailingCity and applicant-info.mailingZIP and applicant-info.mailingState are required fields!');

            })
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
                util.update_input_data(
                    post_input_outfitters_no_applicant_info,
                    {}
                )
            )
            .expect('Content-Type', /json/)
            .expect(function(res){

                expect(res.body.response.message).to.equal('applicant-info is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for outfitters POST request without a firstName', function(done) {

        request(server)
            .post('/permits/special-uses/commercial/outfitters')
            .send(
                util.update_input_data(
                    post_input_outfitters,
                    {
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
                    {
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
                    {
                        "applicant-info": {
                            "firstName": "John",
                            "lastName": "Doe",
                            "emailAddress": "test@email.org",
                            "mailingAddress": "ON ANW 0953",
                            "mailingCity": "ALBANY",
                            "mailingState": "OR",
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
                    {
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
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
                            "mailingZIP": 97321,
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
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
                            "orgType":"Limited Liability Company"
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
            .send(
                util.update_input_data(
                    post_input_outfitters,
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

});
