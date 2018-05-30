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

const error = include('src/controllers/errors/error.js');

const vcapConstants = require('../vcap-constants.js');

//*******************************************************************
// token

/**
 * Verifies that token is a valid token
 * @param  {Object}   req - Request object
 * @param  {Object}   res - Response object
 * @param  {Function} next - What to call after verifying token
 */
function token(req, res, next){

	const token = req.body.token || req.query.token || req.headers['x-access-token'];

	if (token) {

		const claims = {
			issuer: 'fs-epermit-api',
			subject: 'permit applications',
			audience: 'fs-epermit-api-intake-users'
		};

		jwt.verify(token, vcapConstants.JWT_SECRET_KEY, claims, function(err, decoded) {
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

}

//*******************************************************************=
//exports

module.exports = token;
