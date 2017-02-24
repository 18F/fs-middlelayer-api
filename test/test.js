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

describe('FS ePermit API', function() {
    
    it('should return html format if web page', function(done) {
        request(server)
            .get('/')
            .expect('Content-Type', /html/)
            .expect(200, done);
    });
    
    it('should return a 404 error if invalid', function(done) {
        request(server)
            .get('/asdfsad')
            .expect(404, done);
    });
    
    it('should not have x-powered-by header', function(done) {
        request(server)
            .get('/permits/special-uses/noncommercial/1234567890')
            .expect(function(res) {
                expect(res.headers).to.not.have.key('x-powered-by');
            })
            .expect(200, done);
    });
    
    it('should have cors support', function(done) {
        request(server)
            .get('/permits/special-uses/noncommercial/1234567890')
            .expect(function(res) {
                expect(res.headers['access-control-allow-origin']).to.equal('*');
            })
            .expect(200, done);
    });
     
});

//*******************************************************************

