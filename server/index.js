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

//*******************************************************************
// validation

const validateSpecialUse = include('controllers/permits/applications/special-uses/validate.js');
const dbUtil = include('controllers/permits/applications/special-uses/dbUtil.js');
const error = include('error.js');

const Validator = require('jsonschema').Validator;
const v = new Validator();

const util = require('./util.js');

//*******************************************************************
// controller

const get = {};
const post = {};

// get id

get.id = function(req, res, pathData){
	const applicationData = include(pathData.mockOutput);

	let jsonData = {};

	const jsonResponse = {};
	jsonResponse.success = true;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = req.method;
	jsonResponse.src = 'json';
	jsonResponse.route = req.originalUrl;

	const cnData = applicationData[1095010356];

	jsonData = util.copyGenericInfo(cnData, jsonData, pathData.getTemplate);
	const toReturn = Object.assign({}, {response:jsonResponse}, jsonData);

	return toReturn;

};

post.app = function(req, res, pathData){
	const fileToGet = `server/${pathData.validation.$ref.split('#')[0]}`;
	const schemaToGet = pathData.validation.$ref.split('#')[1];
	const applicationSchema = include(fileToGet);
	let key;
	for (key in applicationSchema){
		v.addSchema(applicationSchema[key], key);
	}
	const val = applicationSchema[schemaToGet];
	const error = v.validate(req.body, val).errors;
	const output = {'allgoodpost':{error}};
	//console.log(`output: \n${JSON.stringify(output)}`)
	return output;
};
//*******************************************************************
// exports

module.exports.get = get;
module.exports.post = post;
