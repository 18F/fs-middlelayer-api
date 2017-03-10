/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

function logging(req, message){

	let attemptedRoute = req.originalUrl;
	let browser = req.get('user-agent');
	let referer = req.get('referer');

	let errorLog = {};
	errorLog.route = attemptedRoute;
	errorLog.browser = browser;
	errorLog.referer = referer;
	errorLog.errorMessage = message;

	console.error(errorLog);

}

const sendError = function(req, res, code, message){

	let output = {
		'response': {
			'success' : false,
			'api': 'FS ePermit API',
			'message' : message
		}
	};

	logging(req, message);

	res.status(code).json(output);

};

//*******************************************************************
// exports

module.exports.sendError = sendError;
