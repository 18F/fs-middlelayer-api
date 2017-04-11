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

			let ms = matchstick(k, 'template');
			ms.match(mockPath);

			if( ms.match(mockPath) ) { 


				swagPath = k;
				break;
			}
	    }
	}


    if (!swagPath) {
    	error.sendError(req, res, 404, 'No mock endpoint path found.');
    }
	else {
		if (!mockSwag.paths[swagPath][mockMethod]) {
			error.sendError(req, res, 405, 'No mock endpoint method found.');
		}
		else {
			if (!mockSwag.paths[swagPath][mockMethod].responses) {
				error.sendError(req, res, 500, 'No mock endpoint responses found.');
			}
			else {
				if (!mockSwag.paths[swagPath][mockMethod].responses['200']) {
					error.sendError(req, res, 500, 'No mock endpoint success found.');
				}
				else {
					if (!mockSwag.paths[swagPath][mockMethod].responses['200'].examples) {
						error.sendError(req, res, 500, 'No mock endpoint examples found.');
					}
					else {
						if (!mockSwag.paths[swagPath][mockMethod].responses['200'].examples['application/json']) {
							error.sendError(req, res, 500, 'No mock endpoint json found.');
						}
						else {
							res.json(mockSwag.paths[swagPath][mockMethod].responses['200'].examples['application/json']);
						}
					}
				}
			}
		}
	}
});

//*******************************************************************
//exports

module.exports = router;
