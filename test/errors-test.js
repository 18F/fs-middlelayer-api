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
    
    it('should return valid json and a status code of 400', function(done) {

        request(server)
            .get('/permits/special-uses/noncommercial/errorTest')
            .expect('Content-Type', /json/)
            .expect(400, done);

    });

});



//*******************************************************************
