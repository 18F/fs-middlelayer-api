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
const dbUtil = require('./dbUtil.js');

//*******************************************************************
// validation

const errors = require('./patternErrorMessages.json');
const error = require('./error.js');

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

function getBasicRes(pathData){
	return include(pathData.mockOutput);
}
get.id = function(req, res, pathData){
	const applicationData = getBasicRes(pathData);

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

	res.json(toReturn);

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

function generateErrorMesage(output){

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

//function checkForFilesInSubSchema(schema){}
function checkForFilesInSchema(schema, toCheck){
	
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
			schema.allOf.forEach((sch)=>{
				checkForFilesInSchema(sch, toCheck);
			});
			break;
		case 'properties':
			checkForFilesInSchema(schema.properties, toCheck);
			break;
		default:
			if (schema[key].type === 'file'){
				const obj = {};
				obj[key] = schema[key];
				toCheck.push(obj);
			}
			else if (schema[key].type === 'object'){
				checkForFilesInSchema(schema[key], toCheck);
			}
			break;
		}
	});
}

function getFileInfo(file, constraints){
	const uploadFile = {};
	const uploadField = Object.keys(constraints)[0];
	if (file){
		const filename = path.parse(file[0].originalname).name;

		uploadFile.file = file[0];
		uploadFile.originalname = uploadFile.file.originalname;
		uploadFile.filetype = Object.keys(constraints)[0];
		uploadFile.filetypecode = constraints[uploadFile.filetype].filetypecode;
		uploadFile.ext = path.parse(uploadFile.file.originalname).ext.split('.')[1];
		uploadFile.size = uploadFile.file.size;
		uploadFile.mimetype = uploadFile.file.mimetype;
		uploadFile.encoding = uploadFile.file.encoding;
		uploadFile.buffer = uploadFile.file.buffer;
		uploadFile.filename = uploadField + '-' + filename + '-' + Date.now() + uploadFile.ext;

	}

	return uploadFile;
}

const validateFile = function (uploadFile, validationConstraints, fileName){

	const fileInfo = getFileInfo(uploadFile, validationConstraints);
	const constraints = validationConstraints[fileName];
	const regex = `(^${constraints.validExtensions.join('$|^')}$)`;
	const errObjs = [];

	if (uploadFile){
		if (uploadFile.ext && !fileInfo.ext.toLowerCase().match(regex)){
			errObjs.push(makeErrorObj(fileInfo.filetype, 'invalidExtension', constraints.validExtensions));
		}
		else if (fileMimes.indexOf(fileInfo.mimetype) < 0){
			errObjs.push(makeErrorObj(fileInfo.filetype, 'invalidMime', fileMimes));
		}
		if (fileInfo.size === 0){
			errObjs.push(makeErrorObj(fileInfo.filetype, 'invalidSizeSmall', 0));
		}
		else {
			const fileSizeInMegabytes = fileInfo.size / 1000000.0;
			if (fileSizeInMegabytes > constraints.maxSize){
				errObjs.push(makeErrorObj(fileInfo.filetype, 'invalidSizeLarge', constraints.maxSize));
			}
		}
	}
	else if (constraints.requiredFile){
		errObjs.push(makeErrorObj(fileName, 'requiredFileMissing'));
	}

	return errObjs;
	
};
/** If body passed in as string, converts it to a JSON object
 * @param  {Object} req - request object
 * @return {Object} - request body as a JSON Object
 */
function getBody(req){
	let inputPost = req.body;
	if (inputPost.body) {
		inputPost = JSON.parse(inputPost.body);
	}
	return inputPost;
}
/**
 * @param  {Object} body - user input
 * @param  {[Object} pathData - data from swagger.json
 * @return {[Array[ErrorObj]} - List of all field errors found
 */
function getFieldValidationErrors(body, pathData){
	const processedFieldErrors = {
		errorArray:[]
	};
	const fieldErrors = validateBody(body, pathData);
	//If contactID
		//Ensure contact exists

		//If not, error
	if (fieldErrors.length > 0){
		processErrors(fieldErrors, processedFieldErrors);
	}

	return processedFieldErrors;
}

/** Gets list of fields that are to be stored in DB
 * @param  {Object} schema - Schema to look through to find any fields to store in DB
 * @param  {Array[String]} fieldsToStore - Array containing names of field to store in DB
 */
function getFieldsToStoreInDB(schema, fieldsToStore, path){
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
			for (let i = 0; i < schema.allOf.length; i++){
				getFieldsToStoreInDB(schema.allOf[i], fieldsToStore, `${path}`);
			}
			break;
		case 'properties':
			getFieldsToStoreInDB(schema.properties, fieldsToStore, `${path}`);
			break;
		case 'oneOf':
			for (let i = 0; i < schema.oneOf.length; i++){
				getFieldsToStoreInDB(schema.oneOf[i], fieldsToStore, `${path}`);
			}
			break;
		default:
			const store = schema[key].store;
			let storeInMiddle = false;
			if (store){
				store.forEach((place)=>{
					const location = place.split(':')[0];
					storeInMiddle = storeInMiddle || (location === 'middleLayer');
				});
			}
			if (schema[key].type === 'file'){
				storeInMiddle = false;
			}
			if (storeInMiddle){
				const obj = {};

				if (path !== ''){
					obj[`${path.slice(path.indexOf('.') + 1)}.${key}`] = schema[key];
				}
				else {
					obj[`${key}`] = schema[key];
				}
				fieldsToStore.push(obj);
			}
			else if (schema[key].type === 'object'){
				getFieldsToStoreInDB(schema[key], fieldsToStore, `${path}.${key}`);
			}
			break;
		}
	});
}

/** Formats data from user input, that needs to be submitted to DB, so that DB can receive it.
 * @param  {Object} schema - Schema of application being submitted
 * @param  {Object} body - User input
 * @return {Object} - Containing key:value pairs for all fields expected to be stored in DB
 */
function getDataToStoreInDB(schema, body){
	const fieldsToStoreInDB = [];
	const output = {};
	getFieldsToStoreInDB(schema, fieldsToStoreInDB, '');
	fieldsToStoreInDB.forEach((field)=>{
		const path = Object.keys(field)[0];
		const splitPath = path.split('.');
		let bodyField = body;
		splitPath.forEach((sp)=>{
			bodyField = bodyField[sp];
		});
		if ((typeof bodyField) === 'undefined'){
			bodyField = field[path].default;
		}
		const dbField = field[path].store[0].split(':')[1];
		output[dbField] = bodyField;
	});
	return output;
}

post.app = function(req, res, pathData){

	const body = getBody(req);
	const derefFunc = deref();
	const possbileFiles = [];
	//const basicRequests = [];

	const schema = getValidationSchema(pathData);
	const allErrors = getFieldValidationErrors(body, pathData);
	const sch = derefFunc(schema.schemaToUse, [schema.fullSchema]);
	
	//Files to validate are in filesToCheck
	checkForFilesInSchema(sch, possbileFiles);

	if (possbileFiles.length !== 0){
		possbileFiles.forEach((fileConstraints)=>{
			const key = Object.keys(fileConstraints)[0];
			const fileValidationErrors = validateFile(req.files[key], fileConstraints, key);
			allErrors.errorArray = allErrors.errorArray.concat(fileValidationErrors);
		});
	}
	const errorMessage = generateErrorMesage(allErrors);
	if (allErrors.errorArray.length !== 0){
		return error.sendError(req, res, 400, errorMessage, allErrors.errorArray);
	}
	else {
		const toStoreInDB = getDataToStoreInDB(sch, body);
		const controlNumber = Math.floor((Math.random() * 10000000000) + 1);
		toStoreInDB.control_number = controlNumber; // eslint-disable-line camelcase
		dbUtil.saveApplication(controlNumber, toStoreInDB, function(err, appl){
			if (err){
				return error.sendError(req, res, 500, err);
			}
			else {
				const fileErrors = [];
				possbileFiles.forEach((fileConstraints)=>{
					const key = Object.keys(fileConstraints)[0];
					const fileInfo = getFileInfo(req.files[key], fileConstraints);
					fileInfo.keyname = `${controlNumber}/${fileInfo.filename}`;

					dbUtil.saveFile(appl.id, fileInfo, function(err, file) { // eslint-disable-line no-unused-vars

						if (err) {
							fileErrors.push(fileInfo.filetype + ' failed to save.');
						}

					});
				});
				//save to s3
				//post to suds
				const jsonResponse = {};
				jsonResponse.success = true;
				jsonResponse.api = 'FS ePermit API';
				jsonResponse.type = 'controller';
				jsonResponse.verb = req.method;
				jsonResponse.src = 'json';
				jsonResponse.route = req.originalUrl;
				jsonResponse.origReq = body;
				return res.json(jsonResponse);
			}
		});
		//save to db
	}
};
//*******************************************************************
// exports

module.exports.get = get;
module.exports.post = post;
