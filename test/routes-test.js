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
    
    it('should return valid json for non-commercial GET request for all', function(done) {
        request(server)
            .get('/permits/special-uses/non-commercial')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    
    it('should return valid json for non-commercial GET request for id', function(done) {
        request(server)
            .get('/permits/special-uses/non-commercial/1234')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    
    it('should return valid json for non-commercial PUT request for id', function(done) {
        request(server)
            .put('/permits/special-uses/non-commercial/1234')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    
    it('should return valid json for non-commercial POST request', function(done) {
        request(server)
            .post('/permits/special-uses/non-commercial')
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
            .get('/permits/special-uses/commercial/outfitters/1234')
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
