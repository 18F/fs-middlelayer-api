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
const util = include('controllers/permits/applications/special-uses/utility.js');
const dbUtil = include('controllers/permits/applications/special-uses/dbUtil.js');
const error = include('error.js');

const Validator = require('jsonschema').Validator;
const v = new Validator();

//*******************************************************************
// controller

const get = {};
const post = {};

// get id

get.id = function(mockOutput){
	const applicationData = include(mockOutput);
	return applicationData;

};

post.app = function(req, validationSchema){
	const fileToGet = `schemaRouting/${validationSchema.$ref.split('#')[0]}`;
	const schemaToGet = validationSchema.$ref.split('#')[1];
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
