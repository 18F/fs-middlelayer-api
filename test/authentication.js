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
const server = include('src/index.js');
const util = include('test/utility.js');

const chai = require('chai');
const expect = chai.expect;
const bcrypt = require('bcrypt-nodejs');
const db = include('src/controllers/db.js');
const models = include('src/models');

const factory = require('unionized');
const loginFactory = factory.factory({'username': null, 'password': null});

const noncommercialInput = include('test/data/testInputNoncommercial.json');
const noncommercialFactory = factory.factory(noncommercialInput);

const adminUsername = 'admin' + (Math.floor((Math.random() * 1000000) + 1)).toString();
const adminPassword = 'pwd' + (Math.floor((Math.random() * 1000000) + 1)).toString();

const userUsername = 'user' + (Math.floor((Math.random() * 1000000) + 1)).toString();
const userPassword = 'pwd' + (Math.floor((Math.random() * 1000000) + 1)).toString();

//*******************************************************************

describe('authentication validation', function() {

	let token;
	let userToken;

	before(function(done) {

		models.users.sync({ force: false });
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(adminPassword, salt);
		const userHash = bcrypt.hashSync(userPassword, salt);

		const adminUser = {
			userName: adminUsername, 
			passHash: hash, 
			userRole: 'admin'
		};
		const userUser = {
			userName: userUsername, 
			passHash: userHash, 
			userRole: 'user'
		};

		db.saveUser(adminUser, function(err, usr){
			if (err){
				return false;
			}
			else {
				db.saveUser(userUser, function(err, usr){
					if (!err){
						util.getToken(adminUsername, adminPassword, function(t){
							token = t; 
						});	
						util.getToken(userUsername, userPassword, function(t2){
							userToken = t2;
							return done();
						});
					}
				});
			}
		});
		
	});
	
	after(function(done) {
		
		db.deleteUser(adminUsername, function(err){
			if (err){
				return false;
			}
			else {
				db.deleteUser(userUsername, function(err){
					if (!err){
						return done();
					}
				});
			}
		});
		
	});

	it('should return valid json with a 401 status code for invalid username or password', function(done) {
		request(server)
			.post('/auth')
			.set('Accept', 'application/json')
			.send(loginFactory.create({username:'apiuser', password:'apipwd'}))
			.expect(401, done);
	});

	it('should return valid json with token and a 200 status code for a successful authentication', function(done) {
		request(server)
			.post('/auth')
			.set('Accept', 'application/json')
			.send(loginFactory.create({username: adminUsername, password: adminPassword}))
			.expect(function(res){
				expect(res.body).to.have.property('token'); 
			})
			.expect(200, done);
	});

	it('should return valid json with a 401 status code for a valid username but invalid password', function(done) {
		request(server)
			.post('/auth')
			.set('Accept', 'application/json')
			.send(loginFactory.create({username: adminUsername, password: 'invalidPwd'}))
			.expect(401, done);
	});

	it('should return valid json with 403 when no token provided for a noncommercial POST request', function(done) {
		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.send(noncommercialFactory.create())
			.expect('Content-Type', /json/)
			.expect(403, done);
	});

	it('should return valid json with 401 when an invalid token provided for a noncommercial GET request', function(done) {
		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', 'invalid-token')
			.expect('Content-Type', /json/)
			.expect(401, done);
	});

	it('should return valid json with 200 for a noncommercial POST request when using admin role autherization', function(done) {
		request(server)
			.post('/permits/applications/special-uses/noncommercial/')
			.set('x-access-token', token)
			.send(noncommercialFactory.create())
			.expect('Content-Type', /json/)
			.expect(200, done);
	});

	it('should return valid json with 403 for a noncommercial GET request when using user (unauthorized) role authentication', function(done) {
		request(server)
			.get('/permits/applications/special-uses/noncommercial/123456789/')
			.set('x-access-token', userToken)
			.expect('Content-Type', /json/)
			.expect(403, done);
	});

});
