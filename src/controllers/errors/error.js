/*

  ___ ___       ___               _ _       _   ___ ___
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| |
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

/**
 * Creates JSON response for any error, given a message. Also logs the error.
 * @param  {Object} req     - User request object
 * @param  {String} message - Error message to output
 */
function logging(req, message){

	const attemptedRoute = req.originalUrl;
	const browser = req.get('user-agent');
	const referer = req.get('referer');

	const errorLog = {};
	errorLog.route = attemptedRoute;
	errorLog.browser = browser;
	errorLog.referer = referer;
	errorLog.errorMessage = message;

	console.error(errorLog);

}

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

	logging(req, message);

	res.status(code).json(output);

}

function basicServiceError(req, res, err){
	if (err.statusCode && err.statusCode === 404){
		console.error(err);
		return error.sendError(req, res, 503, 'underlying service unavailable.');
	}
	else if (err.error && err.error.code === 'ETIMEDOUT') {
		return error.sendError(req, res, 504, 'underlying service has timed out.');
	}
	else {
		reject(err);
	}
}

//*******************************************************************
// exports

module.exports.sendError = sendError;
