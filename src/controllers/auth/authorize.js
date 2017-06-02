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
const error = include('src/controllers/errors/error.js');

//*******************************************************************
// authorize

/**
 * Function to authorize users
 * @param  {Object}   req - Request object
 * @param  {Object}   res - Response object
 * @param  {Function} next - What to call after authorizing user
 */
const authorize = function(req, res, next){

	if (req.decoded.role === 'admin'){
		return next();
	}
	
	error.sendError(req, res, 403, 'Forbidden.');
};

//*******************************************************************=
//exports
module.exports = authorize;
