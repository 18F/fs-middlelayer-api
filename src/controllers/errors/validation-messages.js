/*

  ___ ___       ___               _ _       _   ___ ___
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| |
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// other files

const errors = require('./patternErrorMessages.json');
const utility = require('../utility.js');

/**
	 * Creates error message for format errors
	 *
	 * @param  {String} fullPath - path to field where error is at
	 * @return {String}          - error message to be given to user
	 */
function buildFormatErrorMessage(fullPath) {
	const field = fullPath.substring(fullPath.lastIndexOf('.') + 1);
	const readablePath = utility.makePathReadable(fullPath);
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
		let count = 1;
		const length = anyOfFields.length;
		let message = `${utility.makePathReadable(anyOfFields[0])}`;
		while (count < length) {
			const field = anyOfFields[count];
			message = `${message} or ${utility.makePathReadable(field)}`;
			count ++;
		}
		return message;
	}
	else {
		return false;
	}
}
/**
	 * Creates error messages for all file errors
	 * @param {Object} error            - error object to be processed
	 */
function generateFileErrors(error) {
	switch (error.errorType) {
	case 'requiredFileMissing':
		return `${utility.makePathReadable(error.field)} is a required file.`;
	case 'invalidExtension':
		return `${utility.makePathReadable(error.field)} must be one of the following extensions: ${error.expectedFieldType.join(', ')}.`;
	case 'invalidMime':
		return `${utility.makePathReadable(error.field)} must be one of the following mime types: ${error.expectedFieldType.join(', ')}.`;
	case 'invalidSizeSmall':
		return `${utility.makePathReadable(error.field)} cannot be an empty file.`;
	case 'invalidSizeLarge':
		return `${utility.makePathReadable(error.field)} cannot be larger than ${error.expectedFieldType} MB.`;
	}
}

/**
 * Creates error messages for all field errors
 * @param  {Object} error              - error object to be processed
 * @param  {Array}  messages           - Array of all error messages to be returned
 * @return {String}                    - All field error messages concated together
 */
function generateErrorMessage(validationError){
	let message = '';
	switch (validationError.errorType){
	case 'missing':
		message = `${utility.makePathReadable(validationError.field)} is a required field.`;
		break;
	case 'type':
		message = `${utility.makePathReadable(validationError.field)} is expected to be type '${validationError.expectedFieldType}'.`;
		break;
	case 'format':
	case 'pattern':
		message = buildFormatErrorMessage(validationError.field);
		break;
	case 'enum':
		message = `${utility.makePathReadable(validationError.field)} ${validationError.enumMessage}.`;
		break;
	case 'dependencies':
		message = `Having ${utility.makePathReadable(validationError.field)} requires that ${utility.makePathReadable(validationError.dependency)} be provided.`;
		break;
	case 'anyOf':
		message = `Either ${makeAnyOfMessage(validationError.anyOfFields)} is a required field.`;
		break;
	case 'length':
		message = `${utility.makePathReadable(validationError.field)} is too long, must be ${validationError.expectedFieldType} chracters or shorter`;
		break;
	default:
		message = generateFileErrors(validationError);
		break;
	}
	return message;

}

module.exports.generateErrorMessage = generateErrorMessage;
module.exports.makeAnyOfMessage = makeAnyOfMessage;
