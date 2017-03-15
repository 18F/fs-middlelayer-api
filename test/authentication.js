/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

const include = require('include')(__dirname);

const request = require('supertest');
const server = require('../index.js');
const util = include('test/utility.js');

const chai = require('chai');
const expect = chai.expect;

//*******************************************************************

describe('authentication validation', function() {

	it('should return valid json with a 401 status code for invalid username or password', function(done) {
		request(server)
			.post('/auth')
			.set('Accept', 'application/json')
			.send({ 'username': 'apiuser', 'password': 'apipwd' })
			.expect(401, done);
	});

	it('should return valid json with token and a 200 status code for a successful authentication', function(done) {
		request(server)
			.post('/auth')
			.set('Accept', 'application/json')
			.send({ 'username': 'user', 'password': '12345' })
			.expect(function(res){
				expect(res.body).to.have.property('token'); 
			})
			.expect(200, done);
	});

	it('should return valid json with 403 when no token provided for a noncommercial GET request', function(done) {
		request(server)
			.get('/permits/applications/special-uses/noncommercial/1234567890')
			.expect('Content-Type', /json/)
			.expect(403, done);
	});

	it('should return valid json with 401 when an invalid token provided for a noncommercial GET request', function(done) {
		request(server)
			.get('/permits/applications/special-uses/noncommercial/1234567890')
			.set('x-access-token', 'invalid-token')
			.expect('Content-Type', /json/)
			.expect(401, done);
	});

});

describe('autherization with a token with admin role', function() {

	let token;

	before(function(done) {
		util.getToken(function(t){
			token = t;
			return done();
		});
	});

	it('should return valid json with 200 for a noncommercial GET request', function(done) {
		request(server)
			.get('/permits/applications/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);
	});

});

describe('autherization with a token with user (unauthorized) role', function() {

	let token;

	before(function(done) {
		request(server)
			.post('/auth')
			.set('Accept', 'application/json')
			.send({ 'username': 'user2', 'password': '12345' })
			.expect('Content-Type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) {
					console.error(err);
				}
				token = res.body.token;
				done();
			}); 
	});

	it('should return valid json with 403 for a noncommercial GET request with an unauthorized token provided', function(done) {
		request(server)
			.get('/permits/applications/special-uses/noncommercial/1234567890')
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(403, done);
	});

});
