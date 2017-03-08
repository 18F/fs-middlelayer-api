/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// required modules

var include = require('include')(__dirname);

var jwt = require('jsonwebtoken');

var error = include('error.js');

//*******************************************************************
// token

var token = function(req, res, next){
    
	var token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	if (token) {

		jwt.verify(token, 'superSecret', function(err, decoded) {      
			if (err) {
				error.sendError(req, res, 401, 'Failed to authenticate token.');
			} 
			else {
				req.decoded = decoded;    
				return next();
			}
		});

	} 
	else {
		error.sendError(req, res, 403, 'No token provided.');
	}
    
};

//*******************************************************************=
//exports

module.exports = token;
