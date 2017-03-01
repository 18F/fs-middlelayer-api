/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************


var sendError = function(req, res, code, message){

    var output = {
        "response": {
            "success" : false,
            "api": "FS ePermit API",
            "message" : message
        }
    };

    logging(req, message);

    res.status(code).json(output);

};

function logging(req, message){

    var attemptedRoute = req.originalUrl;
    var browser = req.get('user-agent');
    var referer = req.get('referer');

    var errorLog = {};
    errorLog.route = attemptedRoute;
    errorLog.browser = browser;
    errorLog.referer = referer;
    errorLog.errorMessage = message;

    console.error(errorLog);

}

//*******************************************************************
// exports

module.exports.sendError = sendError;
