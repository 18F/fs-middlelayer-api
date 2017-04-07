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
const multer = require('multer');

const error = include('error.js');

const controller = include('server');

//*******************************************************************
// storage

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//*******************************************************************
// router
function process(req, res){
	const mockAPI = req.params.api;
	//console.log('\nmockAPI : ' + mockAPI );

	let mockSwag;

	try {
		mockSwag = include(`server/${mockAPI}.json`);	
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
		return false;
	}
	else {
		//console.log('swagPath true : ' + swagPath );
		if (!mockSwag.paths[swagPath][mockMethod]) {
			error.sendError(req, res, 405, 'No endpoint method found.');
			return false;
		}
		else {
			//console.log('mockMethod true : ' + mockMethod );
			if (!mockSwag.paths[swagPath][mockMethod].responses) {
				error.sendError(req, res, 500, 'No endpoint responses found.');
				return false;
			}
			else {
				//console.log('response true : ' + JSON.stringify(mockSwag.paths[swagPath][mockMethod].responses) );
				if (!mockSwag.paths[swagPath][mockMethod].responses['200']) {
					error.sendError(req, res, 500, 'No endpoint success found.');
					return false;
				}
				else {
					if ( mockMethod === 'get'){
						return mockSwag.paths[swagPath][mockMethod]
					}
					else if (mockMethod === 'post'){

						

						res.json(controller.post.app(req, res, mockSwag.paths[swagPath][mockMethod]));

					}
					//console.log('200 true : ' + JSON.stringify(mockSwag.paths[swagPath][mockMethod].responses['200']) );
				}
			}
		}
	}
}

router.get('/:api/*', function(req, res, next){
	const pathInfo = process(req, res);
	if (pathInfo){
		res.json(controller.get.id(req, res, pathInfo));
	}
});

const postUpload = upload.fields([
	{ name: 'guideDocumentation', maxCount: 1 },
	{ name: 'acknowledgementOfRiskForm', maxCount: 1 },
	{ name: 'insuranceCertificate', maxCount: 1 },
	{ name: 'goodStandingEvidence', maxCount: 1 },
	{ name: 'operatingPlan', maxCount: 1 }
]);

router.post('/:api/*', postUpload, function(req, res, next){
	const pathInfo = process(req, res);
	if (pathInfo){
		controller.post.app(req, res, pathInfo);
	}
});

router.use('/:api/*', function(req, res, next){

	

	//next();

});

//*******************************************************************
//exports

module.exports = router;
