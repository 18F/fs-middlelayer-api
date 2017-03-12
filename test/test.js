/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

const request = require('supertest');
const server = require('../index.js');

const util = require('./utility.js');

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************

describe('FS ePermit API', function() {

	let token;

	before(function(done) {

		util.getToken(function(t){

			token = t;
			return done();

		});
	
	});
	
	it('should return html format if web page', function(done) {

		request(server)
			.get('/')
			.set('x-access-token', token)
			.expect('Content-Type', /html/)
			.expect(200, done);
	
	});
	
	it('should return a 404 error if invalid', function(done) {

		request(server)
			.get('/asdfsad')
			.set('x-access-token', token)
			.expect(404, done);
	
	});
	
	it('should not have x-powered-by header', function(done) {

		request(server)
			.get('/permits/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect(function(res) {

				expect(res.headers).to.not.have.key('x-powered-by');
						
			})
			.expect(200, done);
	
	});
	
	it('should have cors support', function(done) {

		request(server)
			.get('/permits/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect(function(res) {

				expect(res.headers['access-control-allow-origin']).to.equal('*');
			
			})
			.expect(200, done);
	
	});

	it('should have cache-control set', function(done) {

		request(server)
			.get('/permits/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect(function(res) {

				expect(res.headers['cache-control']).to.equal('no-store, no-cache, must-revalidate, proxy-revalidate');
			
			})
			.expect(200, done);
	
	});

	it('should have pragma set', function(done) {

		request(server)
			.get('/permits/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect(function(res) {

				expect(res.headers.pragma).to.equal('no-cache');
			
			})
			.expect(200, done);
	
	});

	it('should have x-xss-protection set', function(done) {

		request(server)
			.get('/permits/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect(function(res) {

				expect(res.headers['x-xss-protection']).to.equal('1; mode=block');
			
			})
			.expect(200, done);
	
	});

});

//*******************************************************************

