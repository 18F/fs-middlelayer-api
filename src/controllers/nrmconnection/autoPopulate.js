/*

  ___ ___       ___               _ _       _   ___ ___
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| |
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// AUTO-POPULATE FUNCTIONS

/**
 * Concats all indexs of input
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}      - Single string made up of all indicies of input
 */
function concat(input){
	const output = input.join('');
	return output;
}

/**
 * Ensures all characters of input are upper case then joins them
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}      - Single string made up of all indicies of input
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
 * @return {String}      - Single string made up of all indicies of input
 */
function ePermitId(input){
	const timeStamp = + new Date();
	input.push(timeStamp);
	return concat(input);
}

/** Finds basic API fields which are to be auto-populated
 * @param  {Array} basicFields - Fields(Objects) which are stored in SUDS
 * @return {Array} - Fields(Objects) which are to be auto-populated
 */
function getAutoPopulatedFields(basicFields){
	const alteredFields = [];
	basicFields.forEach((field)=>{
		const key = Object.keys(field)[0];
		if (!field[key].fromIntake && field[key].madeOf){
			alteredFields.push(field);
		}
	});
	return alteredFields;
}

/**
 * Given a path seperated by periods, return the field specified if it exists, else false.
 * @param  {String} path                  - String made of the path to the desired field, must be seperated by periods
 * @param  {Object} body                  - Object representing the user input
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

/** Given list of fields which must be auto-populate, returns values to store
 * @param  {Array} fieldsToBuild - Array of objects representing Fields which need to be auto-populated
 * @param  {Object} body   - user input
 * @return {Array}         - created values
 */
function buildAutoPopulatedFields(basicFields, person, body){
	const fieldsToBuild = getAutoPopulatedFields(basicFields);
	const output = {};
	fieldsToBuild.forEach((field)=>{
		const key = Object.keys(field)[0];
		const fieldMakeUp = [];
		let autoPopulatedFieldValue = '';
		field[key].madeOf.fields.forEach((madeOfField)=>{
			if (madeOfField.fromIntake){
				const fieldValue = getFieldFromBody(madeOfField.field, body);
				if (fieldValue){
					fieldMakeUp.push(fieldValue);
				}
				else {
					console.error(`${madeOfField.field} does not exist`);
				}
			}
			else {
				fieldMakeUp.push(madeOfField.value);
			}
		});
		switch (field[key].madeOf.function){
		case 'concat':
			autoPopulatedFieldValue = concat(fieldMakeUp);
			break;
		case 'contId':
			if (person){
				if (fieldMakeUp.length > 3){
					fieldMakeUp.pop();
				}
				autoPopulatedFieldValue = contId(fieldMakeUp);
			}
			else {
				const toUse = [];
				toUse.push(fieldMakeUp.pop());
				autoPopulatedFieldValue = contId(toUse);
			}
			break;
		case 'ePermitId':
			autoPopulatedFieldValue = ePermitId(fieldMakeUp);
			break;
		}
		output[key] = autoPopulatedFieldValue;
	});
	return output;
}

//*******************************************************************

module.exports.buildAutoPopulatedFields = buildAutoPopulatedFields;
