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
const AWS = require('aws-sdk');
const async = require('async');
const request = require('request-promise');
const Validator = require('jsonschema').Validator;
const deref = require('deref');
const path = require('path');
const matchstick = require('matchstick');

const apiSchema = include('server/swagger.json');

//*************************************************************
// AWS

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

AWS.config.update({
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	region: AWS_REGION
});

const s3 = new AWS.S3();

//*******************************************************************
// other files

const errors = require('./patternErrorMessages.json');
const error = require('./error.js');
const dbUtil = require('./dbUtil.js');
const util = require('./util.js');

const v = new Validator();

const fileMimes = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword',
	'text/rtf',
	'application/pdf'
];
const basicURL = process.env.BASICURL;

//*******************************************************************
// controller

const use = function(req, res){

	const reqPath = `/${req.params[0]}`;
	const reqMethod = req.method.toLowerCase();

	//console.log('reqPath: ' + reqPath);
	//console.log('reqMethod: ' + reqMethod);

	console.log('\n apiSchemaData(apiSchema, reqPath) : ' + JSON.stringify(apiSchemaData(apiSchema, reqPath)));

	const apiReqData = apiSchemaData(apiSchema, reqPath);
	const apiPath = apiReqData.path;
	const apiTokens = apiReqData.tokens;
	const apiMatches = apiReqData.matches;

	console.log('\n apiTokens : ' + JSON.stringify(apiTokens));
	console.log('\n apiMatches : ' + JSON.stringify(apiMatches));

	console.log('reqPath : ' + reqPath );
	console.log('reqMethod : ' + reqMethod );
	console.log('apiPath : ' + apiPath );

	if (!apiPath) {
		return error.sendError(req, res, 404, 'Invalid endpoint.');
	}
	else {
		//console.log('apiPath true : ' + apiPath );
		if (!apiSchema.paths[apiPath][reqMethod]) {
			return error.sendError(req, res, 405, 'No endpoint method found.');
		}
		else {
			//console.log('reqMethod true : ' + reqMethod );
			if (!apiSchema.paths[apiPath][reqMethod].responses) {
				return error.sendError(req, res, 500, 'No endpoint responses found.');
			}
			else {
				//console.log('response true : ' + JSON.stringify(apiSchema.paths[apiPath][reqMethod].responses) );
				if (!apiSchema.paths[apiPath][reqMethod].responses['200']) {
					return error.sendError(req, res, 500, 'No endpoint success found.');
				}
				else {
					
					const schemaData = apiSchema.paths[apiPath][reqMethod];

					console.log('schemaData : ' + JSON.stringify(schemaData) );

					const reqData = {
						path: apiPath,
						tokens: apiTokens,
						matches: apiMatches,
						schema: schemaData
					};

					if (reqMethod === 'get') {

						if (apiTokens.includes('fileName')) {
							console.log('apiTokens true');

							getControlNumberFileName(req, res, schemaData);

						}
						else {
			
							getControlNumber(req, res, schemaData);
						}

					}
					else if (reqMethod === 'post') {
						postApplication(req, res, schemaData);
					}
	
				}
			}
		}
	}
};

//*************************************************************

const getControlNumberFileName = function(req, res, pathData) {
	console.log('getControlNumberFileName ' );

	res.json('hello');
	
};

const getControlNumber = function(req, res, pathData){
	console.log('getControlNumber ' );

	const basicData = getBasicRes(pathData);

	let jsonData = {};

	const controlNumber = req.params.id;

	const jsonResponse = {};
	jsonResponse.success = true;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = req.method;
	jsonResponse.src = 'json';
	jsonResponse.route = req.originalUrl;

	const cnData = basicData[1095010356];  // TODO: remove - used for mocks

	if (basicData){
		dbUtil.getApplication(controlNumber, function(err, appl){
			if (err){
				return error.sendError(req, res, 400, 'error getting application from database');
			}
			else {
				jsonData = util.copyGenericInfo(cnData, appl, jsonData, pathData.getTemplate);
				const toReturn = Object.assign({}, {response:jsonResponse}, jsonData);

				res.json(toReturn);
			}
		});
	}

};

//*************************************************************

const postApplication = function(req, res, pathData){
	console.log('postApplication ' );

	const body = getBody(req);
	const derefFunc = deref();
	const possbileFiles = [];

	const schema = getValidationSchema(pathData);
	const sch = derefFunc(schema.schemaToUse, [schema.fullSchema]);
	const allErrors = getFieldValidationErrors(body, pathData, sch);
	//Files to validate are in possbileFiles
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

		const controlNumber = Math.floor((Math.random() * 10000000000) + 1); //TODO: remove - used for mocks
		toStoreInDB.control_number = controlNumber;
		dbUtil.saveApplication(controlNumber, toStoreInDB, function(err, appl){
			if (err){
				return error.sendError(req, res, 500, err);
			}
			else {
				saveAndUploadFiles(req, res, possbileFiles, req.files, controlNumber, appl, function(err, data){
					if (err) {
						return error.sendError(req, res, 500, err);
					}
					else {

						postToBasic(req, res, sch, body);
						
					}
				});
			}
		});
	}
};

//*************************************************************

function getBasicRes(pathData){
	return include(pathData.mockOutput);
}

function apiSchemaData(apiSchema, reqPath){

	if (apiSchema) {
		for (const k in apiSchema.paths) {
			//console.log('\nk : ' + JSON.stringify(k) );

			const ms = matchstick(k, 'template');
			//console.log('ms : ' + JSON.stringify(ms) );
			ms.match(reqPath);

			if ( ms.match(reqPath) ) { 

				console.log('ms.tokens : ' + JSON.stringify(ms.tokens) );
				console.log('ms.match : ' + JSON.stringify(ms.match(reqPath)) );
				console.log('ms.matches : ' + JSON.stringify(ms.matches ) );

				return {
					path: k,
					tokens: ms.tokens,
					matches: ms.matches
				};
			}
		}
	}

}

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

let requiredFields = [];
/** Traverses schema object in search of all fields listed as required. Stores all fields in requiredFiles array. 
 * @param  {Object} schema - schema to traverse in search for all required fields
 */
function getAllRequired(schema){
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
			schema.allOf.forEach((sch)=>{
				getAllRequired(sch);
			});
			break;
		case 'properties':
			getAllRequired(schema.properties);
			break;
		case 'required':
			requiredFields = requiredFields.concat(schema.required);
		}
	});
}
/** Traverses through schema to find field specified. Once found it executes a function on that field in the schema.
 * @param  {Object} schema - schema to look for field in
 * @param  {Array[String]} field - Array containing the path to the field to find
 * @param  {Function} func - Function to be run on the schema of field
 */
function findField(schema, field, func){
	const fieldCopy = JSON.parse(JSON.stringify(field));
	const schemaKeys = Object.keys(schema);
	schemaKeys.forEach((key)=>{
		if (key === fieldCopy[0]){
			if (fieldCopy.length === 1){
				func(schema[key]);
			}
			else {
				fieldCopy.shift();
				findField(schema[key], fieldCopy, func);
			}
		}
		else {
			switch (key){
			case 'allOf':
			case 'oneOf':
				schema[key].forEach((sch)=>{
					findField(sch, fieldCopy, func);
				});
				break;
			case 'properties':
				findField(schema.properties, fieldCopy, func);
				break;
			}
		}
	});
}

function handleMissingError(output, result, counter, schema){
	const property = removeInstance(result[counter].property);
	const field = combinePropArgument(property, result[counter].argument);

	if (field.split('.').length > 1){
		findField(schema, field.split('.'), getAllRequired);
		for (const i in requiredFields){
			requiredFields[i] = `${field}.${requiredFields[i]}`;
		}
		requiredFields.forEach((requiredField)=>{
			output.errorArray.push(makeErrorObj(requiredField, 'missing'));
		});
	}
	else {
		output.errorArray.push(makeErrorObj(field, 'missing'));
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
function processErrors(errors, processedErrors, schema){
	const length = errors.length;
	let counter;
	for (counter = 0; counter < length; counter++){

		switch (errors[counter].name){
		case 'required':
			handleMissingError(processedErrors, errors, counter, schema);
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

function getFieldsToStoreInDB(schema, fieldsToStore, path, saveLocation){
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
			for (let i = 0; i < schema.allOf.length; i++){
				getFieldsToStoreInDB(schema.allOf[i], fieldsToStore, `${path}`, saveLocation);
			}
			break;
		case 'properties':
			getFieldsToStoreInDB(schema.properties, fieldsToStore, `${path}`, saveLocation);
			break;
		case 'oneOf':
			for (let i = 0; i < schema.oneOf.length; i++){
				getFieldsToStoreInDB(schema.oneOf[i], fieldsToStore, `${path}`, saveLocation);
			}
			break;
		default:
			const store = schema[key].store;
			let storeInMiddle = false;
			if (store && schema[key].type !== 'file'){
				store.forEach((place)=>{
					const location = place.split(':')[0];
					storeInMiddle = storeInMiddle || (location === saveLocation);
				});
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
				getFieldsToStoreInDB(schema[key], fieldsToStore, `${path}.${key}`, saveLocation);
			}
			break;
		}
	});
}

function generateErrorMesage(output, schema){

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
function getFieldValidationErrors(body, pathData, derefSchema){
	const processedFieldErrors = {
		errorArray:[]
	};
	const fieldErrors = validateBody(body, pathData);
	//If contactID
		//Ensure contact exists

		//If not, error
	if (fieldErrors.length > 0){
		processErrors(fieldErrors, processedFieldErrors, derefSchema);
	}

	return processedFieldErrors;
}

/** Gets list of fields that are to be stored in DB
 * @param  {Object} schema - Schema to look through to find any fields to store in DB
 * @param  {Array[String]} fieldsToStore - Array containing names of field to store in DB
 */
function getFieldsToStoreInDB(schema, fieldsToStore, path, saveLocation){
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
			for (let i = 0; i < schema.allOf.length; i++){
				getFieldsToStoreInDB(schema.allOf[i], fieldsToStore, `${path}`, saveLocation);
			}
			break;
		case 'properties':
			getFieldsToStoreInDB(schema.properties, fieldsToStore, `${path}`, saveLocation);
			break;
		case 'oneOf':
			for (let i = 0; i < schema.oneOf.length; i++){
				getFieldsToStoreInDB(schema.oneOf[i], fieldsToStore, `${path}`, saveLocation);
			}
			break;
		default:
			const store = schema[key].store;
			let storeInMiddle = false;
			if (store && schema[key].type !== 'file'){
				store.forEach((place)=>{
					const location = place.split(':')[0];
					storeInMiddle = storeInMiddle || (location === saveLocation);
				});
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
				getFieldsToStoreInDB(schema[key], fieldsToStore, `${path}.${key}`, saveLocation);
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
	getFieldsToStoreInDB(schema, fieldsToStoreInDB, '', 'middleLayer');
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

function saveAndUploadFiles(req, res, possbileFiles, files, controlNumber, application, callback){
	const asyncTasks = [];

	possbileFiles.forEach((fileConstraints)=>{

		asyncTasks.push(function(callback){
			
			const key = Object.keys(fileConstraints)[0];
			const fileInfo = getFileInfo(files[key], fileConstraints);
			fileInfo.keyname = `${controlNumber}/${fileInfo.filename}`;
			dbUtil.saveFile(application.id, fileInfo, function(err, file) {
				if (err) {
					return error.sendError(req, res, 500, `${fileInfo.filetype} failed to save`);
				}
				const params = {
					Bucket: AWS_BUCKET_NAME, 
					Key: fileInfo.keyname,
					Body: fileInfo.buffer,
					ACL: 'private' 
				};

				s3.putObject(params, function(err, data) {
					if (err) {
						return callback(err, null);
					}
					else {     
						return callback(null, data);
					}      
				});

			});
		});
	});
	async.parallel(asyncTasks, function(err, data){
		if (err){
			return callback(err, null);
		}
		else {
			return callback(null, data);
		}
	});
}

/** Finds basic API fields are to be auto-populated
 * @param  {Array[Object]} basicFields - Fields which are stored in SUDS
 * @return {Array[Object]} - Fields which are to be auto-populated
 */
function getAutoPopulatedFields(basicFields){
	const autoPop = [];
	basicFields.forEach((field)=>{
		const key = Object.keys(field)[0];
		if (!field[key].fromIntake && field[key].madeOf){
			autoPop.push(field);
		}
	});
	return autoPop;
}
/** Given list of fields which must be auto-populate, returns values to store
 * @param  {Array[Object]} - Fields which need to be auto-populated
 * @param  {Object} body - user input
 * @return {Array[]} - created values
 */
function buildAutoPopulatedFields(toBuild, body){
	const output = {};
	toBuild.forEach((field)=>{
		const key = Object.keys(field)[0];
		let fieldValue = '';
		field[key].madeOf.forEach((component)=>{
			if (body[component]){
				fieldValue = `${fieldValue}${body[component]}`;
			}
			else {
				fieldValue = `${fieldValue}${component}`;
			}
		});
		output[key] = fieldValue;
	});
	return output;
}
/**
 * @param  {Array[Object]} fields - All fields which will be sent to basicAPI
 * @param  {Object} body - user input
 * @param  {Object} autoPopValues - All values which have been auto-populated
 * @return {Array[Object]} - Array of post objects
 */
function getBasicFields(fields, body, autoPopValues){
	const requests = [], postObjs = [];
	fields.forEach((field)=>{
		const key = Object.keys(field)[0];
		const whereToStore = field[key].store;
		whereToStore.forEach((location)=>{
			const requestToUse = location.split(':')[1];
			if (location.split(':')[0] === 'basic'){
				let postObjExists = false;
				requests.forEach((request)=>{
					const requestKey = Object.keys(request)[0];
					if (requestKey === requestToUse){
						postObjExists = true;
						request[requestToUse][key] = field[key];
					}
				});
				if (!postObjExists){
					const obj = {};
					obj[requestToUse] = {};
					obj[requestToUse][key] = field[key];
					requests.push(obj);
				}
			}
		});
	});
	requests.forEach((request)=>{
		const key = Object.keys(request)[0];
		const obj = {};
		obj[key] = {};
		Object.keys(request[key]).forEach((fieldKey)=>{
			const field = request[key][fieldKey];
			const fieldPath = fieldKey;
			const splitPath = fieldPath.split('.');
			let bodyField = body;
			if (field.fromIntake){
				splitPath.forEach((sp)=>{
					if (bodyField[sp]){
						bodyField = bodyField[sp];
					}
					else {
						bodyField = field.default;
					}
				});
				obj[key][field.basicField] = bodyField;
			}
			else {
				if (autoPopValues[fieldKey]){
					obj[key][field.basicField] = autoPopValues[fieldKey];
				}
				else {
					obj[key][field.basicField] = field.default;
				}
			}
		});
		postObjs.push(obj);
	});
	return postObjs;
}

/** Takes fields to be stored, creates post objects and populated with user input
 * @param  {Object} sch - validation schema for this request
 * @param  {Object} body - user input
 * @return {Array[Object]} - All post objects 
 */
function prepareBasicPost(sch, body){
	const otherFields = [];
	getFieldsToStoreInDB(sch, otherFields, '', 'basic');
	const toBuild = getAutoPopulatedFields(otherFields);
	const autoPopulateValues = buildAutoPopulatedFields(toBuild, body);
	const fieldsToPost = getBasicFields(otherFields, body, autoPopulateValues);
	return fieldsToPost;
}

function createContact(fieldsObj, person, postObject){
	return new Promise(function(fulfill, reject){
		let contactField, createPersonOrOrgURL;
		if (person){
			contactField = fieldsObj['/contact/person'];
			createPersonOrOrgURL = `${basicURL}/contact/person/`;
		}
		else {
			contactField = fieldsObj['/contact/organization'];
			createPersonOrOrgURL = `${basicURL}/contact/orgcode/`;
		}
		postObject['/contact/personOrOrgcode'].request = contactField;
		const createContactOptions = {
			method: 'POST',
			uri: createPersonOrOrgURL,
			body: contactField,
			json: true
		};
		request(createContactOptions)
		.then(function(res){
			postObject['/contact/personOrOrgcode'].response = res;
			const cn = res.contCn;
			const addressField = fieldsObj['/contact/address'];
			addressField.contact = cn;
			const addressURL = `${basicURL}/contact-address/`;
			postObject['/contact-address'].request = addressField;
			const createAddressOptions = {
				method: 'POST',
				uri: addressURL,
				body: addressField,
				json: true
			};
			return request(createAddressOptions);
		})
		.then(function(res){
			postObject['/contact-address'].response = res;
			const cn = res.contact;
			const phoneField = fieldsObj['/contact/phone'];
			phoneField.contact = cn;
			const phoneURL = `${basicURL}/contact-phone/`;
			postObject['/contact-phone'].request = phoneField;
			const createPhoneOptions = {
				method: 'POST',
				uri: phoneURL,
				body: phoneField,
				json: true
			};
			return request(createPhoneOptions);
		})
		.then(function(res){
			postObject['/contact-phone'].response = res;
			fulfill(res.contact);
		})
		.catch(function(err){
			reject(err);
		});
	});
}

/** Sends requests needed to create an application via the Basic API
 * @param  {Object} req - Request Object
 * @param  {Object} res - Response Object
 * @param  {Object} sch - Schema object 
 * @param  {Object} body - User input
 */
function postToBasic(req, res, sch, body){

	const postObject = {
		'/contact/personOrOrgcode':{},
		'/contact-address':{},
		'/contact-phone':{},
		'/application':{}
	};
	const fieldsToPost = prepareBasicPost(sch, body);
	const fieldsObj = {};
	fieldsToPost.forEach((post)=>{
		const key = Object.keys(post)[0];
		fieldsObj[key] = post[key];
	});

	const org = (body.applicantInfo.orgType && body.applicantInfo.orgType !== 'Individual');
	let existingContactCheck;
	if (org){
		let orgName = body.applicantInfo.organizationName;
		if (!orgName){
			orgName = 'abc';
		}
		existingContactCheck = `${basicURL}/contact/orgcode/${orgName}/`;
	}
	else {
		const lastName = body.applicantInfo.lastName;
		existingContactCheck = `${basicURL}/contact/person/${lastName}/`;
	}
	
	const getContactOptions = {
		method: 'GET',
		uri: existingContactCheck,
		qs:{},
		json: true
	};
	request(getContactOptions)
	.then(function(res){
		if (res.contCN){
			Promise.resolve(res.contCN);
		}
		else {
			return createContact(fieldsObj, true, postObject);
		}
	})
	.then(function(contCN){
		const createApplicationURL = `${basicURL}/application/`;
		fieldsObj['/application'].contCn = contCN;
		const applicationPost = fieldsObj['/application'];
		postObject['/application'].request = applicationPost;
		const createApplicationOptions = {
			method: 'POST',
			uri: createApplicationURL,
			body: applicationPost,
			json: true
		};
		return request(createApplicationOptions);
	})
	.then(function(response){
		postObject['/application'].response = response;
		const jsonResponse = {};
		jsonResponse.success = true;
		jsonResponse.api = 'FS ePermit API';
		jsonResponse.type = 'controller';
		jsonResponse.verb = req.method;
		jsonResponse.src = 'json';
		jsonResponse.route = req.originalUrl;
		jsonResponse.origReq = body;
		jsonResponse.accinstCn = res.accinstCn;
		jsonResponse.basicPosts = postObject;
		return res.json(jsonResponse);
	})
	.catch(function(err){
		return error.sendError(req, res, 500, err);
	});
}

//*******************************************************************
// exports

module.exports.use = use;

//POST
	//Update basic paths so it matches url

	//Returning contents of super field if missing

//GET
//Build Get object from schema
	//Already in examples/200/response
//Populate object
	//Need to use code to pull from middle layer/S3
