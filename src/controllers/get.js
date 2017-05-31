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
const jsf = require('json-schema-faker');
//*******************************************************************

/** Populates fields at the top level of an application
 * @param  {String} intakeField - field in cnData to get the input value.
 * @param  {Object} cnData - application data from Basic API
 * @param  {Object} getSchema - schema used for GET requests
 * @param  {Object} jsonData - object to be populated and returned to user
 * @param  {String} key - field in jsonData to populated
 */
function getTopLevelField(intakeField, cnData, getSchema, jsonData, key){
	switch (intakeField){
	case 'none':
		break;
	default:
		if (cnData.hasOwnProperty(getSchema[key].intake)){
	
			jsonData[key] = cnData[getSchema[key].intake];
		
		}
	}

}
/** Populates fields a sublevel of an application
 * @param  {Object} cnData - application data from Basic API
 * @param  {Object} getSchema - schema used for GET requests
 * @param  {Object} jsonData - object to be populated and returned to user
 * @param  {String} key - field in jsonData to populated
 */
function getSubLevelField(cnData, getSchema, key, jsonData){

	let addressData, phoneData;
	if (cnData.addresses){
		addressData = cnData.addresses[0];
	}
	if (cnData.phones){
		phoneData = cnData.phones[0];
	}
	const path = getSchema[key].intake.split('/');
	let data;
	switch (path[0]){
	case 'phones':
		data = phoneData;
		break;
	case 'addresses':
		data = addressData;
		break;
	}
	if (data && data.hasOwnProperty(path[1])){
		jsonData[key] = data[path[1]];
	}

}

/**
 * @param  {Object} cnData - application data from Basic API
 * @param  {Object} applicationData - data about application, retreived from DB
 * @param  {Object} schemaData - object filled with the default values for a GET request
 * @param  {Object} jsonData - object to be populated and returned to user
 * @param  {Object} getSchema - schema used for GET requests
 */
function buildGetResponse(cnData, applicationData, schemaData, jsonData, getSchema){

	let key; 
	for (key in schemaData){
		
		if (typeof jsonData[key] !== 'object'){
			
			const intakeField = getSchema[key].intake;
			if (intakeField.startsWith('middleLayer/')){
				const applicationField = intakeField.split('/')[1];
				jsonData[key] = applicationData[applicationField];
			}
			else {

				if (intakeField.indexOf('/') === -1){
					getTopLevelField(intakeField, cnData, getSchema, jsonData, key);	
				}
				else {
					
					getSubLevelField(cnData, getSchema, key, jsonData);
				}
			}
		}
		else {
			buildGetResponse(cnData, applicationData, schemaData[key], jsonData[key], getSchema[key]);
		}
	}

}

/**
 * @param  {Object} cnData - application data from Basic API
 * @param  {Object} applicationData - data about application, retreived from DB
 * @param  {Object} jsonData - object to be populated and returned to user
 * @param  {Object} outputSchema - schema used for GET requests
 * @return {Object} object populated with application data
 */
function copyGenericInfo(cnData, applicationData, jsonData, outputSchema){

	jsf.option({useDefaultValue:true});
	const schemaData = jsf(outputSchema);
	delete schemaData.id;

	jsonData = schemaData;
	buildGetResponse(cnData, applicationData, schemaData, jsonData, outputSchema);

	return jsonData;
}

module.exports.copyGenericInfo = copyGenericInfo;
