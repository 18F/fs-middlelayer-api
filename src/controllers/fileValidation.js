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

//*******************************************************************
// other files

const validation = require('./validation.js');

const fileMimes = [
	'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	'application/msword',
	'text/rtf',
	'application/pdf'
];

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
			errObjs.push(validation.makeErrorObj(fileInfo.filetype, 'invalidExtension', constraints.validExtensions));
		}
		else if (fileMimes.indexOf(fileInfo.mimetype) < 0){
			errObjs.push(validation.makeErrorObj(fileInfo.filetype, 'invalidMime', fileMimes));
		}
		if (fileInfo.size === 0){
			errObjs.push(validation.makeErrorObj(fileInfo.filetype, 'invalidSizeSmall', 0));
		}
		else {
			const fileSizeInMegabytes = fileInfo.size / 1000000.0;
			if (fileSizeInMegabytes > constraints.maxSize){
				errObjs.push(validation.makeErrorObj(fileInfo.filetype, 'invalidSizeLarge', constraints.maxSize));
			}
		}
	}
	else if (constraints.requiredFile){
		errObjs.push(validation.makeErrorObj(fileName, 'requiredFileMissing'));
	}

	return errObjs;
	
}

/**
 * Creates error messages for all file errors
 * @param {Object} output           - Error object containing all error to report and the error message to deliver.
 * @param {Array} output.errorArray - Array contain all errors to report to user.
 * @param {Object} error            - error object to be processed
 * @param {Array} messages          - Array of all error messages to be returned
 */
function generateFileErrors(output, error, messages){
	const reqFile = `${validation.makePathReadable(error.field)} is a required file.`;
	const small = `${validation.makePathReadable(error.field)} cannot be an empty file.`;
	const large = `${validation.makePathReadable(error.field)} cannot be larger than ${error.expectedFieldType} MB.`;
	let invExt, invMime;
	if (typeof(error.expectedFieldType) !== 'undefined' && error.expectedFieldType.constructor === Array){
		invExt = `${validation.makePathReadable(error.field)} must be one of the following extensions: ${error.expectedFieldType.join(', ')}.`;
		invMime = `${validation.makePathReadable(error.field)} must be one of the following mime types: ${error.expectedFieldType.join(', ')}.`;
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

module.exports.getFileInfo = getFileInfo;
module.exports.checkForFilesInSchema = checkForFilesInSchema;
module.exports.validateFile = validateFile;
module.exports.generateFileErrors = generateFileErrors;
