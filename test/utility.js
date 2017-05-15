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

//*******************************************************************

function getToken(username, password, callback){

	let token; 

	request(server)
		.post('/auth')
		.set('Accept', 'application/json')
		.send({ 'username': username, 'password': password })
		.expect('Content-Type', /json/)
		.expect(200)
		.end(function(err, res) {

			if (err){
				console.error(err);
			}
			token = res.body.token;
			return callback(token);
				
		});

}

//*******************************************************************
// exports

module.exports.getToken = getToken;
