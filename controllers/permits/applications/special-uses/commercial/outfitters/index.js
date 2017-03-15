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
const outfittersData = include('test/data/basicGET.json');

//*******************************************************************
// validation

const validateSpecialUse = include('controllers/permits/applications/special-uses/validate.js');
const util = include('controllers/permits/applications/special-uses/utility.js');
const error = include('error.js');

//*******************************************************************
// controller

const get = {};
const put = {};

// get id

get.id = function(req, res){
    
	const jsonData = {};

	const jsonResponse = {};
	jsonResponse.success = false;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = 'get';
	jsonResponse.src = 'json';
	jsonResponse.route = 'permits/special-uses/commercial/outfitters/{controlNumber}';
    
	jsonData.response = jsonResponse;

	const cnData = outfittersData[1095010356];

	if (cnData){
        
		const outfittersFields = {};
        
		outfittersFields.activityDescription = cnData.purpose;
		outfittersFields.locationDescription = null;
		outfittersFields.startDateTime = '2017-04-12 09:00:00';
		outfittersFields.endDateTime = '2017-04-15 20:00:00';
		outfittersFields.insuranceCertificate = 'insuranceCertificate.pdf';
		outfittersFields.goodStandingEvidence = 'goodStandingEvidence.pdf';
		outfittersFields.operatingPlan = 'operatingPlan.pdf';

		util.copyGenericInfo(cnData, jsonData);
		jsonData.tempOutfitterFields = outfittersFields;    

		jsonResponse.success = true;
	}
    
	res.json(jsonData);
    
};

// put id

put.id = function(req, res){

	const controlNumber = req.params.id;

	const validateRes = validateSpecialUse.validateInput('outfitters', req);
    
	if (validateRes.success){

		const postData = util.createPost('outfitters', controlNumber, req.body);

		const response = include('test/data/outfitters.put.id.json');

		response.apiRequest = postData;
    
		res.json(response);
    
	}
	else {
    
		error.sendError(req, res, 400, validateRes.errorMessage);
    
	}

};

// post

const post = function(req, res){

	const validateRes = validateSpecialUse.validateInput('outfitters', req);
    
	if (validateRes.success){

		const postData = util.createPost('outfitters', null, req.body);

		const response = include('test/data/outfitters.post.json');

		response.apiRequest = postData;
    
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
