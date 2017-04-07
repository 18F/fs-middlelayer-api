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
const noncommercialData = include('test//data/basicGET.json');

//*******************************************************************
// validation

const validateSpecialUse = include('controllers/permits/applications/special-uses/validate.js');
const util = include('controllers/permits/applications/special-uses/utility.js');
const dbUtil = include('controllers/permits/applications/special-uses/dbUtil.js');
const error = include('error.js');

//*******************************************************************
// controller

const get = {};
const put = {};

// get id

get.id = function(req, res){
    
	let jsonData = {};

	const controlNumber = req.params.id;

	const jsonResponse = {};
	jsonResponse.success = false;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = 'get';
	jsonResponse.src = 'json';
	jsonResponse.route = 'permits/special-uses/noncommercial/{controlNumber}';

	const basicData = noncommercialData[1095010356];

	if (basicData){

		dbUtil.getApplication(controlNumber, function(err, applicationData){

			if (err){
				console.error(err);
				error.sendError(req, res, 400, 'error getting application from database');
			}
			else {

				jsonData = util.copyGenericInfo(basicData, applicationData, jsonData);				

				delete jsonData.tempOutfitterFields;

				jsonResponse.success = true;
				const toReturn = Object.assign({}, {response:jsonResponse}, jsonData);

				res.json(toReturn);
			}
		});
	}
};

// put id

put.id = function(req, res){
	
	const controlNumber = req.params.id;

	const validateRes = validateSpecialUse.validateInput('noncommercial', req);
    
	if (validateRes.success){

		const postData = util.createPost(controlNumber, req.body);

		const response = include('test/data/noncommercial.put.id.json');

		response.apiRequest = postData;
    
		res.json(response);
    
	}
	else {
    
		error.sendError(req, res, 400, validateRes.errorMessage);
    
	}

};

// post

const post = function(req, res){

	const validateRes = validateSpecialUse.validateInput('noncommercial', req);

	if (validateRes.success){

		const postData = util.createPost(null, req.body);

		const response = include('test/data/noncommercial.post.json');

		response.apiRequest = postData;

		// api database updates
		const controlNumber = (Math.floor((Math.random() * 10000000000) + 1)).toString();

		dbUtil.saveApplication(controlNumber, postData, function(err, appl) {

			if (err) {
				error.sendError(req, res, 400, 'error saving application in database', null);
			}

		});
    
		res.json(response);
    
	}
	else {
    
		error.sendError(req, res, 400, validateRes.errorMessage, validateRes.errors);
    
	}
};

//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
