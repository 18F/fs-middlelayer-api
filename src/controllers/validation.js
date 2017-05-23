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
const path = require('path');
const Validator = require('jsonschema').Validator;
const include = require('include')(__dirname);

//*******************************************************************
// other files

const errors = require('./patternErrorMessages.json');

const v = new Validator();

const fileMimes = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword',
	'text/rtf',
	'application/pdf'
];

/**
 * Removes 'instance' from prop field of validation errors. Used to make fields human readable
 * 
 * @param  {string} prop - Prop field from validation error
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
 * @param  {string} property - Upper field to combine
 * @param  {string} argument - Field where error is.
 * @return {string}          - Concatination of property, '.', and argument
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
 * @param {string} field             - Field where error occured at
 * @param {string} errorType         - Type of error returned
 * @param {string} expectedFieldType - Type that the field is expected to be
 * @param {string} enumMessage       - Enum message returned by validation
 * @param {string} dependency        - Fields that are a dependeny of field
 * @param {array} anyOfFields        - Array of strings of all field included in anyOf
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
/**
 * Checks for additional required fields if a missing field has sub fields, stores these fields in requiredFields
 * @param  {Object} schema - schema to traverse in search for all required fields
 */
function checkForExtraRequired(schema){
	const keys = schema.properties;
	for (const key in keys){
		if (schema.properties[key].type === 'object' && schema.required.includes(key)){
			const indexOfSuper = requiredFields.indexOf(key) + 1;

			requiredFields.splice(indexOfSuper, 0, ...schema.properties[key].required.map(function(s){
				return `${key}.${s}`;
			}));
			checkForExtraRequired(schema.properties[key]);
		}
	}
}
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
			checkForExtraRequired(schema);
		}
	});
}
/** Traverses through schema to find field specified. Once found it executes a function on that field in the schema.
 * @param  {Object}   schema - schema to look for field in
 * @param  {Array}    field  - Array(String) containing the path to the field to find
 * @param  {Function} func   - Function to be run on the schema of field
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

/**
 * Handles errors where a required field is missing.
 * @param  {Object} output           - Object used to keep track of any errors, will be outputted if any found
 * @param  {Array} output.errorArray - Array containing error objects which detail errors in schema
 * @param  {Array} result  	         - Array of all errors from schema validator
 * @param  {Number} counter          - Index of the current error
 * @param  {Object} schema           - schema which input is being validated against
 */
function handleMissingError(output, result, counter, schema){

	requiredFields = [];
	const property = removeInstance(result[counter].property);
	const field = combinePropArgument(property, result[counter].argument);

	output.errorArray.push(makeErrorObj(field, 'missing'));
	findField(schema, field.split('.'), getAllRequired);
	for (const i in requiredFields){
		if (requiredFields.hasOwnProperty(i)) {
			requiredFields[i] = `${field}.${requiredFields[i]}`;
		}
	}
	requiredFields.forEach((requiredField)=>{
		output.errorArray.push(makeErrorObj(requiredField, 'missing'));
	});
}

/**
 * Handles errors where a field is the wrong type.
 * @param  {Object} output           - Object used to keep track of any errors, will be outputted if any found
 * @param  {Array} output.errorArray - Array containing error objects which detail errors in schema
 * @param  {Array} result  	         - Array of all errors from schema validator
 * @param  {Number} counter          - Index of the current error
 */
function handleTypeError(output, result, counter){

	const expectedType = result[counter].argument[0];
	const property = removeInstance(result[counter].property);
	output.errorArray.push(makeErrorObj(property, 'type', expectedType));

}

/**
 * Handles errors where a field is formatted wrong.
 * @param  {Object} output           - Object used to keep track of any errors, will be outputted if any found
 * @param  {Array} output.errorArray - Array containing error objects which detail errors in schema
 * @param  {Array} result  	         - Array of all errors from schema validator
 * @param  {Number} counter          - Index of the current error
 */
function handleFormatError(output, result, counter){

	const field = `${removeInstance(result[counter].property)}`;
	output.errorArray.push(makeErrorObj(field, 'format'));

}

/**
 * Handles errors where a field is not one of the enum values.
 * @param  {Object} output            - Object used to keep track of any errors, will be outputted if any found
 * @param  {Array}  output.errorArray - Array containing error objects which detail errors in schema
 * @param  {Array}  result            - Array of all errors from schema validator
 * @param  {Number} counter           - Index of the current error
 */
function handleEnumError(output, result, counter){

	const property = removeInstance(result[counter].property);
	output.errorArray.push(makeErrorObj(property, 'enum', null, result[counter].message));

}

/**
 * Pulls the dependency of a certain field from the error message generated by the schema validator
 * @param  {Array}  result  - Array of all errors from schema validator
 * @param  {Number} counter - Index of the current error
 */
function getDependency(result, counter){

	const stackMessage = result[counter].stack;
	const dependency = stackMessage.split(' property ')[1].split(' not ')[0];
	return dependency;

}

/**
 * Handles errors where a field has a dependency which is not provided.
 * @param  {Object} output            - Object used to keep track of any errors, will be outputted if any found
 * @param  {Array}  output.errorArray - Array containing error objects which detail errors in schema
 * @param  {Array}  result            - Array of all errors from schema validator
 * @param  {Number} counter           - Index of the current error
 */
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
 * @param {Object} errorTracking            - Error object containing all error to report and the error message to deliver.
 * @param {Array}  errorTracking.errorArray - Array contain all errors to report to user.
 * @param {Array}  result                   - Array of errors found during validation.
 * @param {Number} counter                  - Position in result that the current error being handled is.
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
 * @return {Object} schemas  - fullSchema is the full validation schemas for all permit types. schemaToUse is the validation schema for this route
 */
function getValidationSchema(pathData){
	const fileToGet = `src/${pathData['x-validation'].split('#')[0]}`;
	const schemaToGet = pathData['x-validation'].split('#')[1];
	const applicationSchema = include(fileToGet);
	return {
		'fullSchema':applicationSchema,
		'schemaToUse':applicationSchema[schemaToGet]
	};
}

/** Processes ValidationError into ErrorObj, extracting the info needed to create an error message
 * @param  {Array} - Array of ValidationErrors from validation
 * @param  {Array} - Array to store processed ErrorObjs in
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

/** Validates the fields in user input
 * @param  {Object} body             - Input from user to be validated
 * @param  {Object} pathData         - All data from swagger for the path that has been run
 * @param  {Object} validationSchema - schema to be used for validating input, same as validation.json without refs
 * @return {Array}                   - Array of ValidationErrors from validation
 */
function validateBody(body, pathData, validationSchema){
	const processedFieldErrors = {
		errorArray:[]
	};
	const schema = getValidationSchema(pathData);
	const applicationSchema = schema.fullSchema;
	const schemaToUse = schema.schemaToUse;
	let key;
	for (key in applicationSchema){
		if (applicationSchema.hasOwnProperty(key)) {
			v.addSchema(applicationSchema[key], key);
		}
	}
	const val = v.validate(body, schemaToUse);
	const error = val.errors;
	if (error.length > 0){
		processErrors(error, processedFieldErrors, validationSchema);
	}
	return processedFieldErrors;
}

/**
 * Takes input like fieldOne and converts it to Field One so that it is easier to read
 * @param  {String} input - String to be made more readable
 * @return {String}       - More readble string
 */
function makeFieldReadable(input){

	return input
	.replace(/([A-Z])/g, ' $1')
	.replace(/^./, function(str){
		return str.toUpperCase();
	})
	.replace('Z I P', 'Zip')
	.replace('U R L', 'URL');

}

/**
 * Takes input like fieldOne.fieldTwo and converts it to Field One/Field Two to make it easier to read
 * @param  {String} input - path to field which has error
 * @return {String}       - human readable path to errored field
 */
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

/**
 * Creates error message for format errors
 * 
 * @param  {String} fullPath - path to field where error is at
 * @return {String}          - error message to be given to user
 */
function buildFormatErrorMessage(fullPath){
	const field = fullPath.substring(fullPath.lastIndexOf('.') + 1);
	const readablePath = makePathReadable(fullPath);
	const errorMessage = `${readablePath}${errors[field]}`;
	return errorMessage;

}

/**
 * Creates error message for anyOf errors
 * 
 * @param  {array} anyOfFields - list of fields, at least one being required.
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

/**
 * Combines all errors into one string which can be used to determine where all errors are at
 * @param  {Array} errorMessages - Array of error objects
 * @return {String}              - Error message containing all errors
 */
function concatErrors(errorMessages){

	let output = '';
	errorMessages.forEach((message)=>{
		output = `${output}${message} `;
	});
	output = output.trim();
	return output;
}

/**
 * Creates error messages for all file errors
 * @param {Object} output           - Error object containing all error to report and the error message to deliver.
 * @param {Array} output.errorArray - Array contain all errors to report to user.
 * @param {Object} error            - error object to be processed
 * @param {Array} messages          - Array of all error messages to be returned
 */
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

/**
 * Creates error messages for all field errors
 * @param  {Object}  output            - Error object containing all error to report and the error message to deliver.
 * @param  {Array}   output.errorArray - Array contain all errors to report to user.
 * @param  {Object} error              - error object to be processed
 * @param  {Array}  messages           - Array of all error messages to be returned
 * @return {String}                    - All field error messages concated together
 */
function generateErrorMesage(output){

	let errorMessage = '';
	const messages = [];
	output.errorArray.forEach((error)=>{

		const missing = `${makePathReadable(error.field)} is a required field.`;
		const type = `${makePathReadable(error.field)} is expected to be type '${error.expectedFieldType}'.`;
		const enumMessage = `${makePathReadable(error.field)} ${error.enumMessage}.`;
		const dependencies = `Having ${makePathReadable(error.field)} requires that ${makePathReadable(error.dependency)} be provided.`;
		const anyOf = `Either ${makeAnyOfMessage(error.anyOfFields)} is a required field.`;
		const length = `${makePathReadable(error.field)} is too long, must be ${error.expectedFieldType} chracters or shorter`;

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
		case 'length':
			messages.push(length);
			error.message = length;
			break;
		default:
			generateFileErrors(output, error, messages);
			break;
		}
	});
	errorMessage = concatErrors(messages);
	return errorMessage;

}

/**
 * Checks schema for any files that could be provided.
 * @param  {Object} schema  - Schema for an application
 * @param  {Array}  toCheck - List of files to check for, and if present, validate
 */
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

/**
 * Gets basic information about a given file and returns it
 * @param  {Array}  file        - Information about file, include the contents of it in hex
 * @param  {Object} constraints - Description of how to validate file
 * @return {Object}             - basic information about file
 */
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
		uploadFile.filename = uploadField + '-' + filename + '-' + Date.now() + '.' + uploadFile.ext;

	}
	return uploadFile;
}

/**
 * Driving function for validating file
 * @param  {Array}  uploadFile            - Information about file, include the contents of it in hex
 * @param  {Object} validationConstraints - Description of how to validate file
 * @param  {String} fileName              - Name of file being validated
 * @return {Array}                        - Array of all error objects for this file
 */
function validateFile(uploadFile, validationConstraints, fileName){

	const fileInfo = getFileInfo(uploadFile, validationConstraints);
	const constraints = validationConstraints[fileName];
	const regex = `(^${constraints.validExtensions.join('$|^')}$)`;
	const errObjs = [];

	if (uploadFile){
		if (fileInfo.ext && !fileInfo.ext.toLowerCase().match(regex)){
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
	
}

/**
 * Checks the length of all fields with a maxLength field in schema
 * @param  {Object} schema                          - Section of the validation schema being used
 * @param  {Object} input                           - User input being validated
 * @param  {Object} processedFieldErrors            - Current object containing errors
 * @param  {Array}  processedFieldErrors.errorArray - Array of all errors found so far
 * @param  {String} path                            - Path to field being checked
 * @return {Array}                                  - Array of error objects representing all errors found so far
 */
function checkFieldLengths(schema, input, processedFieldErrors, path){
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
		case 'anyOf':
			schema[key].forEach((sch)=>{
				checkFieldLengths(sch, input, processedFieldErrors, path);
			});
			break;
		case 'properties':
			checkFieldLengths(schema.properties, input, processedFieldErrors, path);
			break;
		default:{
			let field;
			if (path === ''){
				field = `${key}`;
			}
			else {
				field = `${path}.${key}`;
			}
			if (schema[key].type === 'object'){
				if (input[key]){
					checkFieldLengths(schema[key], input[key], processedFieldErrors, field);
				}
			}
			else if (schema[key].fromIntake){
				
				if (input){
					const maxLength = schema[key].maxLength;
					const fieldLength = `${input[key]}`.length;

					if (maxLength < fieldLength){
						
						processedFieldErrors.errorArray.push(makeErrorObj(field, 'length', maxLength));
					}

				}

			}
			break;
		}
		}
	});
	return processedFieldErrors;
}

/**
 * Checks that individualIsCitizen field is present if application is a temp-outfitters application and it is for an individual
 * @param  {Object} input                - User input
 * @param  {Object} processedFieldErrors - Object containing all errors from the validation process
 * @return {Object}                      - processedFieldErrors with any errors from this validation step added to it
 */
function checkForIndividualIsCitizen(input, processedFieldErrors){
	if (input.tempOutfitterFields && input.applicantInfo){
		if (!input.applicantInfo.orgType || input.applicantInfo.orgType === 'Individual'){
			if ((typeof input.tempOutfitterFields.individualIsCitizen) !== 'boolean'){
				processedFieldErrors.errorArray.push(makeErrorObj('tempOutfitterFields.individualIsCitizen', 'missing'));
			}
		}
	}
	return processedFieldErrors;
}

/**
 * Checks that smallBusiness field is present if application is a temp-outfitters application and it is not for an individual
 * @param  {Object} input                - User input
 * @param  {Object} processedFieldErrors - Object containing all errors from the validation process
 * @return {Object}                      - processedFieldErrors with any errors from this validation step added to it
 */
function checkForSmallBusiness(input, processedFieldErrors){
	if (input.tempOutfitterFields && input.applicantInfo){
		if (input.applicantInfo.orgType && input.applicantInfo.orgType !== 'Individual'){
			if ((typeof input.tempOutfitterFields.smallBusiness) !== 'boolean'){
				processedFieldErrors.errorArray.push(makeErrorObj('tempOutfitterFields.smallBusiness', 'missing'));
			}
		}
	}
	return processedFieldErrors;
}

/**
 * Checks that organizationName field is present if application is not for an individual
 * @param  {Object} input                - User input
 * @param  {Object} processedFieldErrors - Object containing all errors from the validation process
 * @return {Object}                      - processedFieldErrors with any errors from this validation step added to it
 */
function checkForOrgName(input, processedFieldErrors){
	if (input.applicantInfo){
		if (input.applicantInfo.orgType && input.applicantInfo.orgType !== 'Individual'){
			if (!input.applicantInfo.organizationName || input.applicantInfo.organizationName.length <= 0){
				processedFieldErrors.errorArray.push(makeErrorObj('applicantInfo.organizationName', 'missing'));
			}
		}
	}
	return processedFieldErrors;
}

/**
 * Additional validation checks that can't be defined in the validation schema
 * @param  {Object} validationSchema     - schema to be used for validating input, same as validation.json without refs
 * @param  {Object} input                - User input
 * @param  {Object} processedFieldErrors - Object containing an array of error objects for every error with fields
 * @return {Object}                      - processedFieldErrors with any errors from these validation steps added to it
 */
function additionalValidation(validationSchema, input, processedFieldErrors){
	processedFieldErrors = checkFieldLengths(validationSchema, input, processedFieldErrors, '');
	processedFieldErrors = checkForOrgName(input, processedFieldErrors);
	processedFieldErrors = checkForIndividualIsCitizen(input, processedFieldErrors);
	processedFieldErrors = checkForSmallBusiness(input, processedFieldErrors);
	return processedFieldErrors;
}

/**
 * Drives validation of fields
 * @param  {Object} body             - User input
 * @param  {Object} pathData         - information about path
 * @param  {Object} validationSchema - schema to be used for validating input, same as validation.json without refs
 * @return {Object}                  - Object containing an array of error objects for every error with fields
 */
function getFieldValidationErrors(body, pathData, validationSchema){

	let processedFieldErrors = validateBody(body, pathData, validationSchema);
	processedFieldErrors = additionalValidation(validationSchema, body, processedFieldErrors, '');

	return processedFieldErrors;
}

module.exports.removeInstance = removeInstance;
module.exports.combinePropArgument = combinePropArgument;
module.exports.makeErrorObj = makeErrorObj;
module.exports.getAllRequired = getAllRequired;
module.exports.findField = findField;
module.exports.handleMissingError = handleMissingError;
module.exports.handleTypeError = handleTypeError;
module.exports.handleFormatError = handleFormatError;
module.exports.handleEnumError = handleEnumError;
module.exports.getDependency = getDependency;
module.exports.handleDependencyError = handleDependencyError;
module.exports.handleAnyOfError = handleAnyOfError;
module.exports.getValidationSchema = getValidationSchema;
module.exports.validateBody = validateBody;
module.exports.processErrors = processErrors;
module.exports.makeFieldReadable = makeFieldReadable;
module.exports.makePathReadable = makePathReadable;
module.exports.buildFormatErrorMessage = buildFormatErrorMessage;
module.exports.makeAnyOfMessage = makeAnyOfMessage;
module.exports.concatErrors = concatErrors;
module.exports.generateFileErrors = generateFileErrors;
module.exports.generateErrorMesage = generateErrorMesage;
module.exports.checkForFilesInSchema = checkForFilesInSchema;
module.exports.getFileInfo = getFileInfo;
module.exports.validateFile = validateFile;
module.exports.getFieldValidationErrors = getFieldValidationErrors;
module.exports.checkForSmallBusiness = checkForSmallBusiness;
module.exports.checkForIndividualIsCitizen = checkForIndividualIsCitizen;
module.exports.checkForOrgName = checkForOrgName;
