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
const v = new Validator();

//*******************************************************************

const util = include('controllers/permits/applications/special-uses/utility.js');
const schema = require('./validationSchema.json');

//*******************************************************************
// schemas

const outfitterSchema = schema.tempOutfitterPermit;
const tempOutfitterApplicantInfo = schema.tempOutfitterApplicantInfo;
const tempOutfitterFields = schema.tempOutfitterFields;
const noncommercialSchema = schema.noncommercial;
const applicantInfoNoncommercial = schema.noncommercialApplicantInfo;
const noncommercialFields = schema.noncommercialFields;
const phoneNumber = schema.phoneNumber;
const applicantInfoBase = schema.applicantInfoBase;
const extraFieldsBase = schema.extraFieldsBase;
const topLevelFieldsBase = schema.topLevelFieldsBase;

//*******************************************************************

function zipFormat(input){
	
	let valid = true;

	if (typeof input === 'number'){

		const inputStr = input + '';

		if (!inputStr.match(/^[0-9]{5}$|^[0-9]{9}$/)){

			valid = false;

		}

	}
	return valid;
}
function areaCodeFormat(input){

	let valid = true;

	if (typeof input === 'number'){

		const inputStr = input + '';
		if (!inputStr.match(/^[0-9]{3}$/)){

			valid = false;

		}

	}

	return valid;

}
function phoneNumberFormat(input){

	let valid = true;

	if (typeof input === 'number'){

		const inputStr = input + '';
		if (!inputStr.match(/^[0-9]{7}$/)){

			valid = false;

		}

	}

	return valid;

}

function twoDigitCheck(input){

	let valid = true;
	
	if (typeof input === 'number'){

		const inputStr = input + '';
		
		if (!inputStr.match(/^[0-9]{2}$/)){

			valid = false;

		}

	}

	return valid;

}
function forestFormat(input){

	return twoDigitCheck(input);

}
function regionFormat(input){

	return twoDigitCheck(input);

}
function districtFormat(input){

	return twoDigitCheck(input);

}

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

function makeErrorObj(field, errorType, expectedFieldType, enumMessage, dependency){
	return {
		field,
		errorType,
		expectedFieldType,
		enumMessage,
		dependency
	};
}

function missingSuperFields(output, field, route){

	const applicantInfo = ['applicantInfo.firstName', 'applicantInfo.lastName', 'applicantInfo.dayPhone.areaCode', 'applicantInfo.dayPhone.number', 'applicantInfo.dayPhone.type', 'applicantInfo.emailAddress', 'applicantInfo.mailingAddress', 'applicantInfo.mailingCity', 'applicantInfo.mailingZIP', 'applicantInfo.mailingState'];
	if (route === 'outfitters'){

		applicantInfo.push('applicantInfo.orgType');

	}
	const phone = ['applicantInfo.dayPhone.areaCode', 'applicantInfo.dayPhone.number', 'applicantInfo.dayPhone.type'];
	const noncommercial = ['noncommercialFields.activityDescription', 'noncommercialFields.locationDescription', 'noncommercialFields.startDateTime', 'noncommercialFields.endDateTime', 'noncommercialFields.numberParticipants'];
	const tempOutfitter = ['tempOutfitterFields.activityDescription', 'tempOutfitterFields.locationDescription', 'tempOutfitterFields.startDateTime', 'tempOutfitterFields.endDateTime', 'tempOutfitterFields.insuranceCertificate', 'tempOutfitterFields.goodStandingEvidence', 'tempOutfitterFields.operatingPlan'];
	
	if (field === 'applicantInfo'){

		applicantInfo.forEach((missingField)=>{

			output.errorArray.push(makeErrorObj(missingField, 'missing'));

		});

	}
	else if (field === 'applicantInfo.dayPhone'){

		phone.forEach((missingField)=>{

			output.errorArray.push(makeErrorObj(missingField, 'missing'));

		});

	}
	else if (field === 'noncommercialFields'){

		noncommercial.forEach((missingField)=>{

			output.errorArray.push(makeErrorObj(missingField, 'missing'));

		});

	}
	else {

		tempOutfitter.forEach((missingField)=>{

			output.errorArray.push(makeErrorObj(missingField, 'missing'));

		});
	}
}

function handleMissingError(output, result, counter, route){
	const property = removeInstance(result[counter].property);
	const field = combinePropArgument(property, result[counter].argument);
	switch (field){
	case 'applicantInfo':
	case 'applicantInfo.dayPhone':
	case 'noncommercialFields':
	case 'tempOutfitterFields':
		missingSuperFields(output, field, route);
		break;
	default:
		output.errorArray.push(makeErrorObj(field, 'missing'));
		break;
	}
}

function handleTypeError(output, result, counter){

	const expectedType = result[counter].argument[0];
	const property = removeInstance(result[counter].property);
	output.errorArray.push(makeErrorObj(property, 'type', expectedType));

}

function handleFormatError(output, result, counter){

	const field = `${removeInstance(result[counter].property)}`;
	output.errorArray.push(makeErrorObj(field, 'format'));

}

function handleEnumError(output, result, counter){

	const property = removeInstance(result[counter].property);
	output.errorArray.push(makeErrorObj(property, 'enum', null, result[counter].message));

}

function getDependency(result, counter){

	const stackMessage = result[counter].stack;
	const dependency = stackMessage.split(' property ')[1].split(' not ')[0];
	return dependency;

}

function handleDependencyError(output, result, counter){

	const error = result[counter];
	const dependentField = removeInstance(error.argument);
	const schemaPath = removeInstance(error.property);
	const dependency = `${schemaPath}.${getDependency(result, counter)}`;
	output.errorArray.push(makeErrorObj(dependentField, 'dependencies', null, null, dependency));

}

const validateInput = function (route, req){

	const errorTracking = {
    
		'fieldsValid': true,
		'errorMessage': '',
		'errorArray':[]

	};
	let result, counter;

	v.customFormats.zipFormat = zipFormat;
	v.customFormats.areaCodeFormat = areaCodeFormat;
	v.customFormats.phoneNumberFormat = phoneNumberFormat;
	v.customFormats.forestFormat = forestFormat;
	v.customFormats.regionFormat = regionFormat;
	v.customFormats.districtFormat = districtFormat;

	v.addSchema(phoneNumber, 'phoneNumber');
	v.addSchema(applicantInfoBase, 'applicantInfoBase');
	v.addSchema(applicantInfoNoncommercial, 'applicantInfoNoncommercial');
	v.addSchema(noncommercialFields, 'noncommercialFields');
	v.addSchema(tempOutfitterApplicantInfo, 'tempOutfitterApplicantInfo');
	v.addSchema(tempOutfitterFields, 'tempOutfitterFields');
	v.addSchema(extraFieldsBase, 'extraFieldsBase');
	v.addSchema(topLevelFieldsBase, 'topLevelFieldsBase');

	if (route === 'noncommercial'){

		result = v.validate(req.body, noncommercialSchema).errors;

	}
	else { 

		result = v.validate(req.body, outfitterSchema).errors;        

	}

	const length = result.length;
	if (length > 0){

		errorTracking.fieldsValid = false;

	}
	for (counter = 0; counter < length; counter++){

		if (result[counter].name === 'required'){

			handleMissingError(errorTracking, result, counter, route);

		}
		else  if (result[counter].name === 'type'){

			handleTypeError(errorTracking, result, counter);

		}
		else if (result[counter].name === 'format' || result[counter].name === 'pattern'){

			handleFormatError(errorTracking, result, counter);

		}
		else if (result[counter].name === 'enum'){

			handleEnumError(errorTracking, result, counter);

		}
		else if (result[counter].name === 'dependencies'){

			handleDependencyError(errorTracking, result, counter);

		}
	}

	errorTracking.errorMessage = util.buildErrorMessage(errorTracking);
	const output = {
		'success': errorTracking.fieldsValid,
		'errorMessage': errorTracking.errorMessage,
		'errors': errorTracking.errorArray
	};

	return output;

};

//*******************************************************************
// exports

module.exports.validateInput = validateInput;
