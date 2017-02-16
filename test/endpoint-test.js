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

describe('Generic API Route', function() {
    
    it('should return json format if GET request is valid', function(done) {

        request(server)
            .get('/permit')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('should return json format if POST request is valid', function(done) {

        request(server)
            .post('/permit')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

    it('should return json format if PUT request is valid', function(done) {

        request(server)
            .put('/permit')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });

});

//*******************************************************************

