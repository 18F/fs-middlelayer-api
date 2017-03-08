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

var include = require('include')(__dirname);
var noncommercial_data = require('../../../../test/data/basicGET.json');

//*******************************************************************
// validation

var validate_special_use = include('controllers/permits/special-uses/validate.js');
var util = include('controllers/permits/special-uses/utility.js');
var error = include('error.js');

//*******************************************************************
// controller

var get = {};
var put = {};
var post;

// get all

get.all = function(){

	return include('test/data/noncommercial.get.all.json');

};

// get id

get.id = function(req, res){
    
	var jsonData = {};

	var jsonResponse = {};
	jsonResponse['success'] = false;
	jsonResponse['api'] = 'FS ePermit API';
	jsonResponse['type'] = 'controller';
	jsonResponse['verb'] = 'get';
	jsonResponse['src'] = 'json';
	jsonResponse['route'] = 'permits/special-uses/noncommercial/{controlNumber}';
    
	jsonData.response = jsonResponse;

	var cnData = noncommercial_data[1095010356];

	if (cnData){

		var noncommercialFields = {};
        
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

	var validate_res = validate_special_use.validate_input(req);
    
	if (validate_res.fields_valid){
    
		res.json(include('test/data/noncommercial.post.json'));
    
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
