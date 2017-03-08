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

var test_input = require("./data/test_input_noncommercial.json");

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

//*******************************************************************
//Mock Input

var post_input = test_input.post_input;
var post_input_no_noncommercial_field = test_input.no_noncommercial_field;
var post_input_noncommercial_no_applicant_info = test_input.no_applicant_info_field;



//*******************************************************************

describe('noncommercial POST: required noncommercial fields', function(){

    var token;

    before(function(done) {
      request(server)
        .post('/auth')
        .set('Accept','application/json')
        .send({ "username": "user", "password": "12345" })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          token = res.body.token;
          done();
        });
    });

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

    it('should return valid json with a 400 status code for noncommercial POST request without a noncommercial-fields object', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .set('x-access-token', token)
            .send(
                util.update_input_data(
                    post_input_no_noncommercial_field,
                    {}
                )
            )
            .expect('Content-Type', /json/)
            .expect(function(res){

                expect(res.body.response.message).to.equal('noncommercial-fields is a required field!');

            })
            .expect(400, done);

    });
    
    it('should return valid json with a 400 status code for noncommercial POST request without an activityDescription', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .set('x-access-token', token)
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

                expect(res.body.response.message).to.equal('noncommercial-fields.activityDescription is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a locationDescription', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .set('x-access-token', token)
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

                expect(res.body.response.message).to.equal('noncommercial-fields.locationDescription is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a startDateTime', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .set('x-access-token', token)
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

                expect(res.body.response.message).to.equal('noncommercial-fields.startDateTime is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a endDateTime', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .set('x-access-token', token)
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

                expect(res.body.response.message).to.equal('noncommercial-fields.endDateTime is a required field!');

            })
            .expect(400, done);

    });

    it('should return valid json with a 400 status code for noncommercial POST request without a numberParticipants', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .set('x-access-token', token)
            .send(
                util.update_input_data(
                    post_input,
                    {
                        "noncommercial-fields": {
                            "activityDescription": "PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS",
                            "locationDescription": "string",
                            "startDateTime": "2013-01-12",
                            "endDateTime": "2013-01-19"
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

    it('should return valid json with a 400 status code for an invalid noncommercial POST request', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .set('x-access-token', token)
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

                expect(res.body.response.message).to.equal('noncommercial-fields.endDateTime and noncommercial-fields.numberParticipants are required fields!');

            })
            .expect(400, done);

    });

});

describe('noncommercial POST required applicant-info fields',function(){

    var token;

    before(function(done) {
      request(server)
        .post('/auth')
        .set('Accept','application/json')
        .send({ "username": "user", "password": "12345" })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          token = res.body.token;
          done();
        });
    });

    it('should return valid json with a 400 status code for noncommercial POST request without an applicant-info object', function(done) {

        request(server)
            .post('/permits/special-uses/noncommercial')
            .set('x-access-token', token)
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
            .set('x-access-token', token)
            .send(
                util.update_input_data(
                    post_input,
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
            .set('x-access-token', token)
            .send(
                util.update_input_data(
                    post_input,
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
            .set('x-access-token', token)
            .send(
                util.update_input_data(
                    post_input,
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
            .set('x-access-token', token)
            .send(
                util.update_input_data(
                    post_input,
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
            .set('x-access-token', token)
            .send(
                util.update_input_data(
                    post_input,
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
            .set('x-access-token', token)
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
            .set('x-access-token', token)
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
            .set('x-access-token', token)
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
            .set('x-access-token', token)
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
            .set('x-access-token', token)
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
            .set('x-access-token', token)
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
            .set('x-access-token', token)
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
