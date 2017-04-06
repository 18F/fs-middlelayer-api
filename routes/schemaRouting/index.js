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

const controller = include('schemaControllers');

//*******************************************************************
// router

router.use('/:api/*', function(req, res, next){

	const mockAPI = req.params.api;
	//console.log('\nmockAPI : ' + mockAPI );

	let mockSwag;

	try {
		mockSwag = include(`schemaRouting/${mockAPI}.json`);	
	}
	catch (e) {
		error.sendError(req, res, 405, 'No mock endpoint server found.');
		return;
	}

	const mockPath = `/${req.params[0]}`;
	const mockMethod = req.method.toLowerCase();

	//console.log('mockPath: ' + mockPath);
	//console.log('mockMethod: ' + mockMethod);
	let swagPath;

	if (mockSwag) {
		for (let k in mockSwag.paths) {
			//console.log('\nk : ' + JSON.stringify(k) );

			const ms = matchstick(k, 'template');
			//console.log('ms : ' + JSON.stringify(ms) );
			ms.match(mockPath);

			if ( ms.match(mockPath) ) { 

				//console.log('ms.tokens : ' + JSON.stringify(ms.tokens) );
				//console.log('ms.match : ' + JSON.stringify(ms.match(mockPath)) );
				//console.log('ms.matches : ' + JSON.stringify(ms.matches ) );

				swagPath = k;
				break;
			}
		}
	}

	console.log('\nmockAPI : ' + mockAPI );
	console.log('mockPath : ' + mockPath );
	console.log('mockMethod : ' + mockMethod );
	console.log('swagPath : ' + swagPath );

	if (!swagPath) {
		error.sendError(req, res, 404, 'Invalid endpoint.');
	}
	else {
		//console.log('swagPath true : ' + swagPath );
		if (!mockSwag.paths[swagPath][mockMethod]) {
			error.sendError(req, res, 405, 'No endpoint method found.');
		}
		else {
			//console.log('mockMethod true : ' + mockMethod );
			if (!mockSwag.paths[swagPath][mockMethod].responses) {
				error.sendError(req, res, 500, 'No endpoint responses found.');
			}
			else {
				//console.log('response true : ' + JSON.stringify(mockSwag.paths[swagPath][mockMethod].responses) );
				if (!mockSwag.paths[swagPath][mockMethod].responses['200']) {
					error.sendError(req, res, 500, 'No endpoint success found.');
				}
				else {
					if ( mockMethod === 'get'){
						res.json(controller.get.id(mockSwag.paths[swagPath][mockMethod].mockOutput));
					}
					else if (mockMethod === 'post'){
						
						res.json(controller.post.app(req, mockSwag.paths[swagPath][mockMethod].validation));
					}
					//console.log('200 true : ' + JSON.stringify(mockSwag.paths[swagPath][mockMethod].responses['200']) );
				}
			}
		}
	}

	//next();

});

//*******************************************************************
//exports

module.exports = router;
