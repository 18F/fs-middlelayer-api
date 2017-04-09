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

const express = require('express');
const router = express.Router();
const include = require('include')(__dirname);

const matchstick = require('matchstick');

const error = include('error.js');

//*******************************************************************
// router

router.use('/:api/*', function(req, res, next){

	let mockAPI = req.params['api'];
	//console.log('\nmockAPI : ' + mockAPI );

	let mockSwag;

	try {
		mockSwag = include('mocks/'+ mockAPI +'.json');	
	}
	catch (e) {
		error.sendError(req, res, 405, 'No mock endpoint server found.');
		return;
	}

	let mockPath = '/' + req.params[0];
	let mockMethod = req.method.toLowerCase();

	let swagPath;

	if (mockSwag) {
		for (let k in mockSwag.paths) {
			//console.log('\nk : ' + JSON.stringify(k) );

			let ms = matchstick(k, 'template');
			ms.match(mockPath);

			if( ms.match(mockPath) ) { 

				//console.log('ms.tokens : ' + JSON.stringify(ms.tokens) );
				//console.log('ms.match : ' + JSON.stringify(ms.match(mockPath)) );
				console.log('ms.matches : ' + JSON.stringify(ms.matches ) );

				swagPath = k;
				break;
			}
	    }
	}

    //console.log('\nmockAPI : ' + mockAPI );
    //console.log('mockPath : ' + mockPath );
    //console.log('mockMethod : ' + mockMethod );
    //console.log('swagPath : ' + swagPath );

    if (!swagPath) {
    	error.sendError(req, res, 404, 'No mock endpoint path found.');
    }
	else {
		//console.log('swagPath true : ' + swagPath );
		if (!mockSwag.paths[swagPath][mockMethod]) {
			error.sendError(req, res, 405, 'No mock endpoint method found.');
		}
		else {
			//console.log('mockMethod true : ' + mockMethod );
			if (!mockSwag.paths[swagPath][mockMethod].responses) {
				error.sendError(req, res, 500, 'No mock endpoint responses found.');
			}
			else {
				//console.log('response true : ' + JSON.stringify(mockSwag.paths[swagPath][mockMethod].responses) );
				if (!mockSwag.paths[swagPath][mockMethod].responses['200']) {
					error.sendError(req, res, 500, 'No mock endpoint success found.');
				}
				else {
					//console.log('200 true : ' + JSON.stringify(mockSwag.paths[swagPath][mockMethod].responses['200']) );
					if (!mockSwag.paths[swagPath][mockMethod].responses['200'].examples) {
						error.sendError(req, res, 500, 'No mock endpoint examples found.');
					}
					else {
						//console.log('examples true : ' + JSON.stringify(mockSwag.paths[swagPath][mockMethod].responses['200'].examples) );
						
						if (!mockSwag.paths[swagPath][mockMethod].responses['200'].examples['application/json']) {
							error.sendError(req, res, 500, 'No mock endpoint json found.');
						}
						else {
							//console.log('application/json true : ' + JSON.stringify(mockSwag.paths[swagPath][mockMethod].responses['200'].examples['application/json']) );
							res.json(mockSwag.paths[swagPath][mockMethod].responses['200'].examples['application/json']);
						}
					}
				}
			}
		}
	}

	//next();

});

//*******************************************************************
//exports

module.exports = router;
