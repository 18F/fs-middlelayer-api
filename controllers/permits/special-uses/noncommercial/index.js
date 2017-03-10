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
const noncommercial_data = include('test//data/basicGET.json');

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
	jsonResponse['route'] = 'permits/special-uses/noncommercial/{controlNumber}';
    
	jsonData.response = jsonResponse;

	let cnData = noncommercial_data[1095010356];

	if (cnData){

		let noncommercialFields = {};
        
		noncommercialFields.activityDescription = cnData.purpose;
		noncommercialFields.locationDescription = null;
		noncommercialFields.startDateTime = '2017-04-12 09:00:00';
		noncommercialFields.endDateTime = '2017-04-15 20:00:00';
		noncommercialFields.numberParticipants = 45;

		util.copyGenericInfo(cnData, jsonData);
		jsonData['noncommercial-fields'] = noncommercialFields;    
		jsonResponse['success'] = true;
        
	}
    
	res.json(jsonData);

};

// put id

put.id = function(req, res){
    
	res.json(include('test/data/noncommercial.put.id.json'));

};

// post

post = function(req, res){

	//console.log('req body='+JSON.stringify(req.body));

	let validate_res = validate_special_use.validate_input(req);
    
	if (validate_res.fields_valid){

		let postData = util.create_post('noncommercial', req.body);

		let response = include('test/data/noncommercial.post.json');

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
