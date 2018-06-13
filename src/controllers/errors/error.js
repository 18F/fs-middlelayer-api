/*

  ___ ___       ___               _ _       _   ___ ___
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| |
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';
const logger = require('../utility.js').logger;

//*******************************************************************

/**
 * Returns error message, and any error objects to user
 * @param  {Object} req     - User request object
 * @param  {Object} res     - Response object
 * @param  {integer} code    - Status code to return
 * @param  {String} message - Error message to return
 * @param  {Array} errors  - Array of error objects to return
 */
function sendError(req, res, code, message, errors){

	const output = {
		'status' : 'error',
		message,
		errors
	};

	logger.error('ERROR:', req.url, req.method, message);

	res.status(code).json(output);

}

function SUDSServiceError(req, res, err){
	logger.error('ERROR:', err);
	if (err.statusCode && err.statusCode === 404){
		return this.sendError(req, res, 503, 'underlying SUDS service unavailable.');
	}
	else if (err.error && err.error.code === 'ETIMEDOUT') {
		return this.sendError(req, res, 504, 'underlying SUDS service has timed out.');
	}
	else {
		return this.sendError(req, res, 500, 'Unknown server error.');
	}
}

function getErrorHandle(req, res, err) {
	logger.error('ERROR:', err);
	if (err.message === '404') {
		return sendError(req, res, 404, 'file not found in the database.');
	}
	return sendError(req, res, 500, 'error while getting application from the database.');
}
/** reject with error
* @param {Object} error - error object
* @param {Object} reject - rejection from a promise
* @param {String} controller - string of where the controller occurred
* @reject {Object} error
*/ 
function rejectWithError(error, reject, controller) {
	if (error.message === ''){
		error.message = 'Promise rejected in chain';
	}
	logger.error(`ERROR: ${error.message} in ${controller} controller`);
	reject(error);
}

//*******************************************************************
// exports

module.exports.sendError = sendError;
module.exports.SUDSServiceError = SUDSServiceError; 
module.exports.getErrorHandle = getErrorHandle;
module.exports.rejectWithError = rejectWithError;
