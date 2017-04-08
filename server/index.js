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

const errors = require('./patternErrorMessages.json');
const error = require('./error.js')

const Validator = require('jsonschema').Validator;
const v = new Validator();

const util = require('./util.js');
const deref = require('deref');
const path = require('path');

const fileMimes = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword',
	'text/rtf',
	'application/pdf'
];

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

/**
 * Removes 'instance' from prop field of validation errors. Used to make fields human readable
 * 
 * @param {string} prop - Prop field from validation error
 * @return {string}
 */
function removeInstance(prop){

	let fixedProp = '';

	if (prop.indexOf('.') !== -1){

		fixedProp = prop.substring((prop.indexOf('.') + 1), (prop.length));

	}

	return fixedProp;

}

/**
 * Combines property and argument fields, if property exists, for missing field errors
 *
 * @param  {string}
 * @param  {string}
 * @return {string}
 */
function combinePropArgument(property, argument){

	let field;
	if (property.length > 0){

		field = `${property}.${argument}`;

	}
	else {

		field = argument;

	}

	return field;

}
/**
 * Creates error object which can be read by error message building function
 * 
 * @param {string} field
 * @param {string} errorType
 * @param {string} expectedFieldType
 * @param {string} enumMessage
 * @param {string} dependency
 * @param {array[string]} anyOfFields
 * 
 * @return Error object
 */
function makeErrorObj(field, errorType, expectedFieldType, enumMessage, dependency, anyOfFields){
	const output = {
		field,
		errorType,
		expectedFieldType,
		enumMessage,
		dependency,
		anyOfFields
	};
	let key;
	for (key in output){
		if (output[key] === null){
			delete output[key];
		}
	}
	return output;
}

function missingSuperFields(output, field, route){

	const applicantInfo = ['applicantInfo.firstName', 'applicantInfo.lastName', 'applicantInfo.dayPhone.areaCode', 'applicantInfo.dayPhone.number', 'applicantInfo.dayPhone.type', 'applicantInfo.emailAddress', 'applicantInfo.mailingAddress', 'applicantInfo.mailingCity', 'applicantInfo.mailingZIP', 'applicantInfo.mailingState'];
	if (route === 'tempOutfitters'){

		applicantInfo.push('applicantInfo.orgType');

	}
	const phone = ['applicantInfo.dayPhone.areaCode', 'applicantInfo.dayPhone.number', 'applicantInfo.dayPhone.type'];
	const noncommercial = ['noncommercialFields.activityDescription', 'noncommercialFields.locationDescription', 'noncommercialFields.startDateTime', 'noncommercialFields.endDateTime', 'noncommercialFields.numberParticipants'];
	const tempOutfitter = ['tempOutfitterFields.activityDescription', 'tempOutfitterFields.clientCharges'];
	
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

function handleMissingError(output, result, counter){
	const property = removeInstance(result[counter].property);
	const field = combinePropArgument(property, result[counter].argument);
	switch (field){
	/*
	case 'applicantInfo':
	case 'applicantInfo.dayPhone':
	case 'noncommercialFields':
	case 'tempOutfitterFields':
		missingSuperFields(output, field, route);
	 	break;
	 */
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

/**
 * Creates error object for errors resulting from an anyOf section of the validation schema
 *
 * @param {object} errorTracking - Error object containing all error to report and the error message to deliver.
 * @param {array} errorTracking.errorArray - Array contain all errors to report to user.
 * @param {array} result - Array of errors found during validation.
 * @param {integer} counter - Position in result that the current error being handled is.
 * 
 * @affects errorTracking.errorArray 
 */
function handleAnyOfError(errorTracking, result, counter){

	const error = result[counter];
	const property = removeInstance(error.property);
	const requiredOptions = [];
	error.schema.anyOf.forEach((fieldObj)=>{
		requiredOptions.push(combinePropArgument(property, fieldObj.required[0]));
	});
	errorTracking.errorArray.push(makeErrorObj(null, 'anyOf', null, null, null, requiredOptions));
	
}

/** Get the schema to be used for validating user input
 * @param  {Object} pathData - All data from swagger for the path that has been run
 * @return {Object} schemas - fullSchema is the full validation schemas for all permit types. schemaToUse is the validation schema for this route
 */
function getValidationSchema(pathData){
	const fileToGet = `server/${pathData.validation.$ref.split('#')[0]}`;
	const schemaToGet = pathData.validation.$ref.split('#')[1];
	const applicationSchema = include(fileToGet);
	return {
		'fullSchema':applicationSchema,
		'schemaToUse':applicationSchema[schemaToGet]
	};
}

/** Validates the fields in user input
 * @param  {Object} body - Input from user to be validated
 * @param  {Object} pathData - All data from swagger for the path that has been run
 * @return {Array[{ValidationError}]} - All field errors from validation
 */
function validateBody(body, pathData){
	const schema = getValidationSchema(pathData);
	const applicationSchema = schema.fullSchema;
	const schemaToUse = schema.schemaToUse;
	let key;
	for (key in applicationSchema){
		v.addSchema(applicationSchema[key], key);
	}
	const error = v.validate(body, schemaToUse).errors;
	return error;
}

/** Processes ValidationError into ErrorObj, extracting the info needed to create an error message
 * @param  {Array[{ValidationError}]} - All field errors from validation
 * @param  {Array[{ErrorObjs}]} - Array to store processed ErrorObjs in
 */
function processErrors(errors, processedErrors){
	const length = errors.length;
	let counter;
	for (counter = 0; counter < length; counter++){

		switch (errors[counter].name){
		case 'required':
			handleMissingError(processedErrors, errors, counter);
			break;
		case 'type':
			handleTypeError(processedErrors, errors, counter);
			break;
		case 'format':
		case 'pattern':
			handleFormatError(processedErrors, errors, counter);
			break;
		case 'enum':
			handleEnumError(processedErrors, errors, counter);
			break;
		case 'dependencies':
			handleDependencyError(processedErrors, errors, counter);
			break;
		case 'anyOf':
			handleAnyOfError(processedErrors, errors, counter);
			break;
		}
	}
}

function makeFieldReadable(input){

	return input
	.replace(/([A-Z])/g, ' $1')
	.replace(/^./, function(str){
		return str.toUpperCase();
	})
	.replace('Z I P', 'Zip')
	.replace('U R L', 'URL');

}

function makePathReadable(input){

	if (typeof input === 'string'){
		const parts = input.split('.');
		const readableParts = [];
		let readablePath = '';
		parts.forEach((field)=>{
			readableParts.push(makeFieldReadable(field));
		});
		readablePath = readableParts.shift();
		readableParts.forEach((part)=>{
			readablePath = `${readablePath}/${part}`;
		});
		return readablePath;
	}
	else {
		return false;
	}

}

function buildFormatErrorMessage(fullPath){
	const field = fullPath.substring(fullPath.lastIndexOf('.') + 1);
	const readablePath = makePathReadable(fullPath);
	const errorMessage = `${readablePath}${errors[field]}`;
	return errorMessage;

}

/**
 * Creates error message for anyOf errors
 * 
 * @param  {array[string]} anyOfFields - list of fields, at least one being required.
 * @return {string}
 */
function makeAnyOfMessage(anyOfFields){
	if (anyOfFields){
		let output, count = 1;
		const length = anyOfFields.length;
		output = `${makePathReadable(anyOfFields[0])}`;
		while (count < length) {
			const field = anyOfFields[count];
			output = `${output} or ${makePathReadable(field)}`;
			count ++;
		}
		return output;
	}
	else {
		return false;
	}
}

function concatErrors(errorMessages){

	let output = '';
	errorMessages.forEach((message)=>{
		output = `${output}${message} `;
	});
	output = output.trim();
	return output;
}
function generateFileErrors(output, error, messages){
	const reqFile = `${makePathReadable(error.field)} is a required file.`;
	const small = `${makePathReadable(error.field)} cannot be an empty file.`;
	const large = `${makePathReadable(error.field)} cannot be larger than ${error.expectedFieldType} MB.`;
	let invExt, invMime;
	if (typeof(error.expectedFieldType) !== 'undefined' && error.expectedFieldType.constructor === Array){
		invExt = `${makePathReadable(error.field)} must be one of the following extensions: ${error.expectedFieldType.join(', ')}.`;
		invMime = `${makePathReadable(error.field)} must be one of the following mime types: ${error.expectedFieldType.join(', ')}.`;
	}

	switch (error.errorType){
	case 'requiredFileMissing':
		messages.push(reqFile);
		error.message = reqFile;
		break;
	case 'invalidExtension':
		messages.push(invExt);
		error.message = invExt;
		break;
	case 'invalidMime':
		messages.push(invMime);
		error.message = invMime;
		break;
	case 'invalidSizeSmall':
		messages.push(small);
		error.message = small;
		break;
	case 'invalidSizeLarge':
		messages.push(large);
		error.message = large;
		break;
	}
}

function generateErrors(output){

	let errorMessage = '';
	const messages = [];
	output.errorArray.forEach((error)=>{

		const missing = `${makePathReadable(error.field)} is a required field.`;
		const type = `${makePathReadable(error.field)} is expected to be type '${error.expectedFieldType}'.`;
		const enumMessage = `${makePathReadable(error.field)} ${error.enumMessage}.`;
		const dependencies = `Having ${makePathReadable(error.field)} requires that ${makePathReadable(error.dependency)} be provided.`;
		const anyOf = `Either ${makeAnyOfMessage(error.anyOfFields)} is a required field.`;

		switch (error.errorType){
		case 'missing':
			messages.push(missing);
			error.message = missing;
			break;
		case 'type':
			messages.push(type);
			error.message = type;
			break;
		case 'format':
		case 'pattern':
			messages.push(buildFormatErrorMessage(error.field));
			error.message = buildFormatErrorMessage(error.field);
			break;
		case 'enum':
			messages.push(enumMessage);
			error.message = enumMessage;
			break;
		case 'dependencies':
			messages.push(dependencies);
			error.message = dependencies;
			break;
		case 'anyOf':
			messages.push(anyOf);
			error.message = anyOf;
			break;
		default:
			generateFileErrors(output, error, messages);
			break;
		}
	});
	errorMessage = concatErrors(messages);
	return errorMessage;

}

const validateFile = function (uploadFile, validationConstraints){

	const regex = `(^${validationConstraints.validExtensions.join('$|^')}$)`;
	const errObjs = [];

	if (uploadFile.ext && !uploadFile.ext.toLowerCase().match(regex)){
		errObjs.push(makeErrorObj(uploadFile.filetype, 'invalidExtension', validationConstraints.validExtensions));
	}
	else if (fileMimes.indexOf(uploadFile.mimetype) < 0){
		errObjs.push(makeErrorObj(uploadFile.filetype, 'invalidMime', fileMimes));
	}
	if (uploadFile.size === 0){
		errObjs.push(makeErrorObj(uploadFile.filetype, 'invalidSizeSmall', 0));
	}
	else {
		const fileSizeInMegabytes = uploadFile.size / 1000000.0;
		if (fileSizeInMegabytes > validationConstraints.maxSize){
			errObjs.push(makeErrorObj(uploadFile.filetype, 'invalidSizeLarge', validationConstraints.maxSize));
		}
	}

	return errObjs;
	
};

const filesToCheck = [];
function checkForFilesInSchema(schema){
	
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
			for (let i = 0; i < schema.allOf.length; i++){
				checkForFilesInSchema(schema.allOf[i]);
			}
			break;
		case 'properties':
			checkForFilesInSchema(schema.properties);
			break;
		default:
			if (schema[key].type === 'file'){
				const obj = {};
				obj[key] = schema[key];
				filesToCheck.push(obj);
			}
			else if (schema[key].type === 'object'){
				checkForFilesInSchema(schema[key]);
			}
			break;
		}
	});
}

post.app = function(req, res, pathData){
	
	let inputPost = req.body;
	if (inputPost.body) {
		inputPost = JSON.parse(inputPost.body);
	}
	const derefFunc = deref();
	const processedErrors = {
		errorArray:[]
	};
	let fileErrors = [];

	const schema = getValidationSchema(pathData);
	const errors = validateBody(inputPost, pathData);
	const sch = derefFunc(schema.schemaToUse, [schema.fullSchema]);
	checkForFilesInSchema(sch);
	if (filesToCheck.length !== 0 && req.files && Object.keys(req.files).length > 0){
		filesToCheck.forEach((file)=>{
			const key = Object.keys(file)[0];

			const uploadFile = {};

			const currentFile = req.files[key];
			if (currentFile){
				uploadFile.file = currentFile[0];

				uploadFile.originalname = uploadFile.file.originalname;
				uploadFile.filename = path.parse(uploadFile.file.originalname).name;
				uploadFile.filetype = key;
				//uploadFile.filetypecode = filesUploadList[i][1];
				uploadFile.ext = path.parse(uploadFile.file.originalname).ext.split('.')[1];
				uploadFile.size = uploadFile.file.size;
				uploadFile.mimetype = uploadFile.file.mimetype;
				uploadFile.encoding = uploadFile.file.encoding;
				uploadFile.buffer = uploadFile.file.buffer;
				//uploadFile.keyname = `${controlNumber}/${uploadField}-${uploadFile.filename}-${Date.now()}${uploadFile.ext}`;

				fileErrors = fileErrors.concat(validateFile(uploadFile, file[key]));
			}
			else if (file[key].requiredFile){
				fileErrors.push(makeErrorObj(key, 'requiredFileMissing'));
			}
		});
		processedErrors.errorArray = processedErrors.errorArray.concat(fileErrors);
	}
	let errorMessage;
	if (errors.length > 0){
		processErrors(errors, processedErrors);
		errorMessage = generateErrors(processedErrors);
	}
	if (processedErrors.errorArray.length !== 0){
		return error.sendError(req, res, 400, errorMessage, processedErrors.errorArray);
	}
	else {
		const jsonResponse = {};
		jsonResponse.success = true;
		jsonResponse.api = 'FS ePermit API';
		jsonResponse.type = 'controller';
		jsonResponse.verb = req.method;
		jsonResponse.src = 'json';
		jsonResponse.route = req.originalUrl;
		jsonResponse.origReq = inputPost;
		res.json(jsonResponse);
	}
};
//*******************************************************************
// exports

module.exports.get = get;
module.exports.post = post;
