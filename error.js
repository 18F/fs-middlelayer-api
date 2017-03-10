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

const sendError = function(req, res, code, message){

	const output = {
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
