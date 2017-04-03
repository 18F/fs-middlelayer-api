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

const include = require('include')(__dirname);

const jwt = require('jsonwebtoken');

const error = include('error.js');

const jwtSecretKey = process.env.JWT_SECRET_KEY;

//*******************************************************************
// token

const token = function(req, res, next){
    
	const token = req.body.token || req.query.token || req.headers['x-access-token'];
	
	if (token) {

		jwt.verify(token, jwtSecretKey, function(err, decoded) {      
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
