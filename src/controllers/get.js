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

const db = require('./db.js');
const NRMConnection = require('./nrmconnection');
const error = require('./errors/error.js');
const fileStore = require('./filestore.js');
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

/** Controller for GET routes with only a control number
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Object} reqData - Object containing information about the request and the route requested
 * @param  {String} reqData.path - Path being requested
 * @param  {Array} reqData.tokens - Array of all tokens present in path being requested
 * @param  {Object} reqData.matches - Object with key pair values of all tokens present in the request
 * @param  {Object} reqData.schema - Schema of the route requested
 */
function getControlNumber(req, res, reqData) {
	const pathData = reqData.schema;
	const fileTypes = {
		'gud': 'guideDocumentation',
		'arf': 'acknowledgementOfRiskForm',
		'inc': 'insuranceCertificate',
		'gse': 'goodStandingEvidence',
		'opp': 'operatingPlan'
	};

	const reqPath = `/${req.params[0]}`;

	if (reqPath.indexOf('/files') !== -1) {
		let controlNumber = reqData.matches.controlNumber;
		controlNumber = controlNumber.substr(0, controlNumber.length - 6);

		db.getApplication(controlNumber, function (err, appl, fileData) {

			if (err) {
				console.error(err);
				return error.sendError(req, res, 500, 'error while getting application from the database.');
			}

			else if (fileData) {

				fileStore.getFilesZip(controlNumber, fileData, res);

			}
			else {
				error.sendError(req, res, 404, 'file not found in the database.');
			}

		});

	}
	else {

		let basicData = {};
		NRMConnection.getFromBasic(req, res, reqData.matches.controlNumber)
			.then((applicationDataFromNRM) => {

				let jsonData = {};
				const controlNumber = reqData.matches.controlNumber;
				const jsonResponse = {};

				if (applicationDataFromNRM) {

					db.getApplication(controlNumber, function (err, appl, fileData) {
						if (err) {
							console.error(err);
							return error.sendError(req, res, 500, 'error while getting application from the database.');
						}
						else {

							if (!appl) {
								return error.sendError(req, res, 404, 'application not found in the database.');
							}
							else if (fileData) {
								fileData.forEach(function (file) {
									const fileType = fileTypes[file.fileType];
									appl[fileType] = file.fileName;
								});
							}
							jsonData = copyGenericInfo(applicationDataFromNRM, appl, jsonData, pathData['x-getTemplate']);
							jsonData.controlNumber = controlNumber;

							jsonResponse.status = 'success';
							const toReturn = Object.assign({}, jsonResponse, jsonData);

							res.json(toReturn);
						}
					});
				}
			})
			.catch((err) => {
				console.error(err);
				return error.sendError(req, res, 500, 'unable to process request.');
			});

	}

}

module.exports.getControlNumber = getControlNumber;
