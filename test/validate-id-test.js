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

describe('permitId validation', function() {

	it('should return valid json with a 400 status code for non-commercial GET request with invalid id', function(done) {
        request(server)
            .get('/permits/special-uses/noncommercial/1234')
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

    it('should return valid json with a 400 status code for outfitters GET request with invalid id', function(done) {
        request(server)
            .get('/permits/special-uses/commercial/outfitters/1234')
            .expect('Content-Type', /json/)
            .expect(400, done);
    });

});
