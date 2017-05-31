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

//*******************************************************************

const request = require('supertest');
const server = include('src/index.js');
const util = include('test/utility.js');

const factory = require('unionized');

const noncommercialInput = include('test/data/testInputNoncommercial.json');
const testURL = '/permits/applications/special-uses/noncommercial/';

const chai = require('chai');
const expect = chai.expect;
const bcrypt = require('bcrypt-nodejs');
const db = include('src/controllers/db.js');
const models = include('src/models');

const adminUsername = 'admin' + (Math.floor((Math.random() * 1000000) + 1)).toString();
const adminPassword = 'pwd' + (Math.floor((Math.random() * 1000000) + 1)).toString();

//*******************************************************************
//Mock Input

const noncommercialFactory = factory.factory(noncommercialInput);

//*******************************************************************

describe('Integration tests - noncommercial', function(){
	
	let token;
	let postControlNumber;

	before(function(done) {

		models.users.sync({ force: false });
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(adminPassword, salt);

		const adminUser = {
			userName: adminUsername, 
			passHash: hash, 
			userRole: 'admin'
		};

		db.saveUser(adminUser, function(err){
			if (err){
				return false;
			}
			else {
				
				util.getToken(adminUsername, adminPassword, function(t){
					token = t;
					return done();
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
				return done();
			}
		});
		
	});

	it('should return valid json with a 400 status code for noncommercial POST request without an applicantInfo object', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create({applicantInfo : undefined}))
			.expect('Content-Type', /json/)
			.expect(function(res){
				expect(res.body.message).to.equal('Applicant Info is a required field. Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field. Applicant Info/Day Phone is a required field. Applicant Info/Day Phone/Area Code is a required field. Applicant Info/Day Phone/Number is a required field. Applicant Info/Day Phone/Phone Type is a required field. Applicant Info/Email Address is a required field. Applicant Info/Mailing Address is a required field. Applicant Info/Mailing City is a required field. Applicant Info/Mailing Zip is a required field. Applicant Info/Mailing State is a required field.');

			})
			.expect(400, done);

	});

	it('should return valid json for noncommercial POST request (contact search - uses existing contact)', function(done) {
		const noncommercialInput = noncommercialFactory.create();
		noncommercialInput.applicantInfo.firstName = 'Fname';
		noncommercialInput.applicantInfo.lastName = 'Lname';
		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialInput)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

	it('should return valid json with 400 status for noncommercial POST request (contact search - duplicate contacts error)', function(done) {
		const noncommercialInput = noncommercialFactory.create();
		noncommercialInput.applicantInfo.organizationName = 'Temp Organization';
		noncommercialInput.applicantInfo.orgType = 'Corporation';
		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialInput)
			.expect('Content-Type', /json/)
			.expect(400, done);

	});

	it('should return valid json for noncommercial POST request (controlNumber to be used in GET)', function(done) {

		request(server)
			.post(testURL)
			.set('x-access-token', token)
			.send(noncommercialFactory.create())
			.expect('Content-Type', /json/)
			.expect(function(res){
				postControlNumber = res.body.controlNumber;
			})
			.expect(200, done);

	});
	
	it('should return valid json for noncommercial GET request for id', function(done) {

		request(server)
			.get(`${testURL}${postControlNumber}/`)
			.set('x-access-token', token)
			.expect('Content-Type', /json/)
			.expect(200, done);

	});

});
