/*

  ___ ___	   ___			   _ _	   _   ___ ___
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_	/_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| |
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

const logger = require('../utility.js').logger;

//*******************************************************************
// AUTO-POPULATE FUNCTIONS

/**
 * Concats all indexs of input
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}	  - Single string made up of all indicies of input
 */
function concat(input){
	const output = input.join('');
	return output;
}

/**
 * Ensures all characters of input are upper case then joins them
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}	  - Single string made up of all indicies of input
 */
function contId(input){
	return concat(
		input.map((i)=>{
			return i.toUpperCase();
		})
	);
}

/**
 * Adds UNIX timestamp and then joins all elements of input
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}	  - Single string made up of all indicies of input
 */
function ePermitId(input){
	const timeStamp = + new Date();
	input.push(timeStamp);
	return concat(input);
}

/** Finds SUDS API fields which are to be auto-populated
 * @param  {Array} sudsFields - Fields(Objects) which are stored in SUDS
 * @return {Array} alteredFields - Fields(Objects) which are to be auto-populated
 */
function findAutoPopulatedFieldsFromSchema(sudsFields){
	const autoPopultatedFields = [];
	sudsFields.forEach((field)=>{
		const key = Object.keys(field)[0];
		if (!field[key].fromIntake && field[key].madeOf){
			autoPopultatedFields.push(field);
		}
	});
	return autoPopultatedFields;
}

/**
 * Given a path seperated by periods, return the field specified if it exists, else false.
 * @param  {String} path				  - String made of the path to the desired field, must be seperated by periods
 * @param  {Object} body				  - Object representing the user input
 * @return {Boolean|String|Number|Object} - Contents of the field specified or false
 */
function getFieldFromBody(path, body){
	const pathParts = path.split('.');
	pathParts.forEach((pathPart)=>{
		body = body[pathPart];
	});
	if (body){
		return body;
	}
	else {
		return false;
	}
}

/**
 * Handle autoPolutated values based on what type of field
 * @param {Object} field - field to evaluated
 * @param {Boolean} person - whether the input is for an individual or an organization?
 * @param {Array} fieldMakeUp - array of the subfields or strings that comprise the field
 * @return {String} fieldValue - the string of the fieldValue
 */
function generateAutoPopulatedField(field, person, fieldMakeUp) {
	if (field.sudsName === 'contId') {
		console.log(field, person, fieldMakeUp);
	}
	let fieldValue;
	switch (field.madeOf.function) {
	case 'concat':
		fieldValue = concat(fieldMakeUp);
		break;
	case 'contId':
		if (person) {
			if (fieldMakeUp.length > 3) {
				fieldMakeUp.pop();
			}
			fieldValue = contId(fieldMakeUp);
			console.log("I AM A PERSON");
		}
		else {
			const toUse = [];
			toUse.push(fieldMakeUp.pop());
			console.log("I AM NOT PERSON", toUse);
			fieldValue = contId(toUse);
		}
		break;
	case 'ePermitId':
		fieldValue = ePermitId(fieldMakeUp);
		break;
	}
	return fieldValue;
}

/** Given list of fields which must be auto-populate, returns values to store
 * @param  {Array} fieldsToBuild - Array of objects representing Fields which need to be auto-populated
 * @param {boolean} person - Not sure?
 * @param  {Object} body   - user input
 * @return {Array}		 - created values
 */
function buildAutoPopulatedField(field, person, body){
	if (field === 'contId') {
		console.log(field, person);
	}
	const fieldMakeUp = [];
	field.madeOf.fields.forEach((madeOfField)=>{
		if (madeOfField.fromIntake){
			const fieldValue = getFieldFromBody(madeOfField.field, body);
			if (fieldValue){
				fieldMakeUp.push(fieldValue);
			}
			else {
				logger.warn(`${madeOfField.field} does not exist. This may not be an issue if the field is optional.`);
			}
		}
		else {
			fieldMakeUp.push(madeOfField.value);
		}
	});
	
	return generateAutoPopulatedField(field, person, fieldMakeUp);
}

/**
 * Gets the value of an intake field that will be posted to SUDS
 * @param {Object} intakeRequest - body of the incoming post request
 * @param {Object} field - specific field to identify
 * @param {Array} splitPath - Array of path elements for JSON object, e.g. ['applicantInfo', 'firstName']
 * @return {String| integer} - value of the field
 */
function extractIntakeValue(intakeRequest, field, splitPath) {
	let bodyCopy = Object.assign({}, intakeRequest);

	splitPath.forEach((path) => {
		if (bodyCopy[path]) {
			bodyCopy = bodyCopy[path];
		}
	});
	if (typeof bodyCopy !== typeof {}){
		return bodyCopy;
	}
	return field.default;
}

/**
 * Populates an individual field value 
 * @param  {Object} field - Schema information about a specific field
 * @param {Object} intakeRequest - body of the incoming post request
 * @param {Array} splitPath - an array of the object keys to that field
 * @param {Arrary} autoPopFields - Array of fields that need to be autopopulated
 * @param {String} fieldKey - key of the field that will be field that the data will be extracted for
 * @return {String|integer} - value of the field
 */
function generateValue(field, intakeRequest, splitPath, person, fieldKey, autoPopulatedFields) {
	if (field.fromIntake) {
		return extractIntakeValue(intakeRequest, field, splitPath);
	}
	if (autoPopulatedFields.includes(fieldKey)) {
		const built = buildAutoPopulatedField(field, person, intakeRequest);
		return built;
	}
	return field.default;
}

/**
 * Gets the data from all fields that are to be send to the SUDS API, also builds post object, used to pass data to basic api
 * @param  {Array} fieldsToBasic - All fields in object form which will be sent to basicAPI
 * @param {Object} intakeRequest - body of the incoming post request
 * @param {Arrary} autoPopFields - Array of fields that need to be autopopulated
 * @return {Object} - Array of endpoints with which fields should go in them
 */
function populateValues(fieldsByEndpoint, intakeRequest, autoPopulatedFields, person){
	console.log('popped person value', person)
	const requestsTobeSent = {};
	for (const endpoint in fieldsByEndpoint){
		if (fieldsByEndpoint.hasOwnProperty(endpoint)){
			requestsTobeSent[endpoint] = {};
			for (const fieldKey in fieldsByEndpoint[endpoint]){
				if (fieldsByEndpoint[endpoint].hasOwnProperty(fieldKey)){
					const field = fieldsByEndpoint[endpoint][fieldKey];
					const splitPath = fieldKey.split('.');
					let sudsFieldName = splitPath[splitPath.length - 1];
					console.log(sudsFieldName, field.sudsField);
					if (field.hasOwnProperty('sudsField')) {
						sudsFieldName = field.sudsField;
					}
					const autoPopulatedKeys = autoPopulatedFields.map(obj => {
						return Object.keys(obj)[0];
					});
					const generatedValue = generateValue(field, intakeRequest, splitPath, person, fieldKey, autoPopulatedKeys);
					requestsTobeSent[endpoint][sudsFieldName] = generatedValue;
				}
			}
		}
	}
	return requestsTobeSent;
}

//*******************************************************************

module.exports.populateValues = populateValues;
module.exports.findAutoPopulatedFieldsFromSchema = findAutoPopulatedFieldsFromSchema;
module.exports.generateAutoPopulatedField = generateAutoPopulatedField;
