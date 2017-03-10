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
const outfitters_data = include('test/data/basicGET.json');

//*******************************************************************
// validation

const validate_special_use = include('controllers/permits/special-uses/validate.js');
const util = include('controllers/permits/special-uses/utility.js');
const error = include('error.js');

//*******************************************************************
// controller

let get = {};
let put = {};
let post;

// get id

get.id = function(req, res){
    
	let jsonData = {};

	let jsonResponse = {};
	jsonResponse['success'] = false;
	jsonResponse['api'] = 'FS ePermit API';
	jsonResponse['type'] = 'controller';
	jsonResponse['verb'] = 'get';
	jsonResponse['src'] = 'json';
	jsonResponse['route'] = 'permits/special-uses/commercial/outfitters/{controlNumber}';
    
	jsonData.response = jsonResponse;

	let cnData = outfitters_data[1095010356];

	if (cnData){
        
		let outfittersFields = {};
        
		outfittersFields.activityDescription = cnData.purpose;
		outfittersFields.locationDescription = null;
		outfittersFields.startDateTime = '2017-04-12 09:00:00';
		outfittersFields.endDateTime = '2017-04-15 20:00:00';
		outfittersFields.insuranceCertificate = 'insuranceCertificate.pdf';
		outfittersFields.goodStandingEvidence = 'goodStandingEvidence.pdf';
		outfittersFields.operatingPlan = 'operatingPlan.pdf';

		util.copyGenericInfo(cnData, jsonData);
		jsonData['temp-outfitter-fields'] = outfittersFields;    

		jsonResponse['success'] = true;
	}
    
	res.json(jsonData);
    
};

// put id

put.id = function(req, res){

	res.json(include('test/data/outfitters.put.id.json'));

};

// post

post = function(req, res){

	let validate_res = validate_special_use.validate_input(req);
    
	if (validate_res.fields_valid){
    
		//console.log('req body='+JSON.stringify(req.body));

		let postData = util.create_post('outfitters', req.body);

		let response = include('test/data/outfitters.post.json');

		response['apiRequest'] = postData;
    
		res.json(response);
    
	}
	else {
    
		error.sendError(req, res, 400, validate_res.error_message);
    
	}

};

//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
