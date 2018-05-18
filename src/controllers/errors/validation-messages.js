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

/**
 * Takes input like fieldOne and converts it to Field One so that it is easier to read
 * @param  {String} input - String to be made more readable
 * @return {String}       - More readble string
 */
function makeFieldReadable(input) {

	return input
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, function (str) {
			return str.toUpperCase();
		})
		.replace('Z I P', 'Zip')
		.replace('U R L', 'URL');

}

/**
 * Takes input like fieldOne.fieldTwo and converts it to Field One/Field Two to make it easier to read
 * @param  {String} input - path to field which has error
 * @return {String|Boolean}       - human readable path to errored field or FALSE if not string
 */
function makePathReadable(input) {

	if (typeof input === 'string') {
		const parts = input.split('.');
		const readableParts = [];
		parts.forEach((field) => {
			readableParts.push(makeFieldReadable(field));
		});
		return readableParts.join('/');
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
function buildFormatErrorMessage(fullPath) {
	const field = fullPath.substring(fullPath.lastIndexOf('.') + 1);
	const readablePath = makePathReadable(fullPath);
	const errorMessage = `${readablePath}${errors[field]}`;
	return errorMessage;

}

/**
 * Creates error message for anyOf errors
 *
 * @param  {array?} anyOfFields - list of fields, at least one being required.
 * @return {string|Boolean} - return message or FALSE is not anyOfFields
 */
function makeAnyOfMessage(anyOfFields){
	if (anyOfFields){
		let count = 1;
		const length = anyOfFields.length;
		let message = `${makePathReadable(anyOfFields[0])}`;
		while (count < length) {
			const field = anyOfFields[count];
			message = `${message} or ${makePathReadable(field)}`;
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
	 * @return {String}                 - message of error
	 */
function generateFileErrors(error) {
	switch (error.errorType) {
	case 'requiredFileMissing':
		return `${makePathReadable(error.field)} is a required file.`;
	case 'invalidExtension':
		return `${makePathReadable(error.field)} must be one of the following extensions: ${error.expectedFieldType.join(', ')}.`;
	case 'invalidMime':
		return `${makePathReadable(error.field)} must be one of the following mime types: ${error.expectedFieldType.join(', ')}.`;
	case 'invalidSizeSmall':
		return `${makePathReadable(error.field)} cannot be an empty file.`;
	case 'invalidSizeLarge':
		return `${makePathReadable(error.field)} cannot be larger than ${error.expectedFieldType} MB.`;
	}
	return '';
}

/**
 * Creates error messages for all field errors
 * @param  {Object} validationError          - error object to be processed
 * @return {String}                    - All field error messages concated together
 */
function generateErrorMessage(validationError){
	let message = '';
	switch (validationError.errorType){
	case 'missing':
		message = `${makePathReadable(validationError.field)} is a required field.`;
		break;
	case 'type':
		message = `${makePathReadable(validationError.field)} is expected to be type '${validationError.expectedFieldType}'.`;
		break;
	case 'format':
	case 'pattern':
		message = buildFormatErrorMessage(validationError.field);
		break;
	case 'enum':
		message = `${makePathReadable(validationError.field)} ${validationError.message}.`;
		break;
	case 'dependencies':
		message = `Having ${makePathReadable(validationError.field)} requires that ${makePathReadable(validationError.dependency)} be provided.`;
		break;
	case 'anyOf':
		message = `Either ${makeAnyOfMessage(validationError.anyOfFields)} is a required field.`;
		break;
	case 'length':
		message = `${makePathReadable(validationError.field)} is too long, must be ${validationError.expectedFieldType} chracters or shorter`;
		break;
	default:
		message = generateFileErrors(validationError);
		break;
	}
	return message;

}

module.exports.makeFieldReadable = makeFieldReadable;
module.exports.makePathReadable = makePathReadable;
module.exports.generateErrorMessage = generateErrorMessage;
module.exports.makeAnyOfMessage = makeAnyOfMessage;
