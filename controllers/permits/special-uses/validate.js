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
const Validator = require('jsonschema').Validator;

//*******************************************************************

const util = include('controllers/permits/special-uses/utility.js');
const schema = require('./validationSchema.json');
const v = new Validator();

//*******************************************************************
// schemas

const outfitterSchema = schema.outfitter;
const applicantInfoTempOutfitter = schema.outfitterApplicantInfo;
const tempOutfitterFields = schema.tempOutfitterFields;
const noncommercialSchema = schema.noncommercial;
const applicantInfoNoncommercial = schema.noncommercialApplicantInfo;
const noncommercialFields = schema.noncommercialFields;
const phoneNumber = schema.phoneNumber;

//*******************************************************************

function removeInstance(prop){

	let fixedProp = '';
	if (prop.indexOf('.') !== -1){

		fixedProp = prop.substring((prop.indexOf('.') + 1), (prop.length));

	}

	return fixedProp;

}

function combinePropArgument(property, argument){

	let field;
	if (property.length > 0){

		field = property + '.' + argument;

	}
	else {

		field = argument;

	}

	return field;

}

function handleMissingError(output, result, counter){

	const property = removeInstance(result[counter].property);
	const field = combinePropArgument(property, result[counter].argument);
	util.invalidField(output, field);

}

function handleTypeError(output, result, counter){

	console.log(result);
	const expectedType = result[counter].argument[0];
	const property = removeInstance(result[counter].property);
	util.fieldType(output, property, expectedType);

}
//Needs to take in route(noncom/out)
const validateInput = function (route, req){

	const output = {
    
		'fieldsValid': true,
		'errorMessage': '',
		'missingArray': [],
		'typeArray': []

	};
	let result, counter;
	v.addSchema(phoneNumber, 'phoneNumber');
	v.addSchema(applicantInfoNoncommercial, 'applicantInfoNoncommercial');
	v.addSchema(noncommercialFields, 'noncommercialFields');
	v.addSchema(applicantInfoTempOutfitter, 'applicantInfoTempOutfitter');
	v.addSchema(tempOutfitterFields, 'tempOutfitterFields');
	if (route === 'noncommercial'){

		result = v.validate(req.body, noncommercialSchema).errors;

	}
	else { 

		result = v.validate(req.body, outfitterSchema).errors;        

	}

	const length = result.length;
	for (counter = 0; counter < length; counter++){

		if (result[counter].name === 'required'){

			handleMissingError(output, result, counter);

		}
		else {

			handleTypeError(output, result, counter);

		}

	}

	output.errorMessage = util.buildErrorMessage(output);

	return output;

};

//*******************************************************************
// exports

module.exports.validateInput = validateInput;
