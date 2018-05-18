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
 * @param  {Array}  postedFiles - List of files to check for, and if present, validate
 */
function checkForFilesInSchema(schema, postedFiles){
	const keys = Object.keys(schema);
	keys.forEach((key)=>{
		switch (key){
		case 'allOf':
			schema.allOf.forEach((sch)=>{
				checkForFilesInSchema(sch, postedFiles);
			});
			break;
		case 'properties':
			checkForFilesInSchema(schema.properties, postedFiles);
			break;
		default:
			if (schema[key].type === 'file'){
				const obj = {};
				obj[key] = schema[key];
				postedFiles.push(obj);
			}
			else if (schema[key].type === 'object'){
				checkForFilesInSchema(schema[key], postedFiles);
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
 * @param  {Validator} Validator		  - Class instance of validation
 * 
 * @returns {Array}                       - returns the Validator Object's array
 */
function validateFile(uploadFile, validationConstraints, fileName, Validator){

	const fileInfo = getFileInfo(uploadFile, validationConstraints);
	const constraints = validationConstraints[fileName];
	const regex = `(^${constraints.validExtensions.join('$|^')}$)`;

	if (uploadFile){
		if (fileInfo.ext && !fileInfo.ext.toLowerCase().match(regex)){
			Validator.pushErrorObject({
				field: fileInfo.filetype,
				errorType: 'invalidExtension',
				expectedFieldType: constraints.validExtensions
			});
		}
		else if (fileMimes.indexOf(fileInfo.mimetype) < 0){
			Validator.pushErrorObject({
				field: fileInfo.filetype, 
				errorType: 'invalidMime',
				expectedFieldType: fileMimes
			});
		}
		if (fileInfo.size === 0){
			Validator.pushErrorObject({
				field: fileInfo.filetype,
				errorType: 'invalidSizeSmall',
				expectedFieldType: 0
			});
		}
		else {
			const fileSizeInMegabytes = fileInfo.size / 1000000.0;
			if (fileSizeInMegabytes > constraints.maxSize){
				Validator.pushErrorObject({
					field: fileInfo.filetype, 
					errorType: 'invalidSizeLarge', 
					expectedFieldType: constraints.maxSize
				});
			}
		}
	}
	else if (constraints.requiredFile){
		Validator.pushErrorObject({
			field: fileName, 
			errorType: 'requiredFileMissing'
		});
	}

	return Validator.errorArray;
	
}

module.exports.getFileInfo = getFileInfo;
module.exports.checkForFilesInSchema = checkForFilesInSchema;
module.exports.validateFile = validateFile;
