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

describe('Error function: sendError', function() {

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
    
    it('should return valid json and a status code of 400', function(done) {
        request(server)
            .get('/permits/special-uses/noncommercial/errorTest')
            .set('x-access-token', token)
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

});



//*******************************************************************
