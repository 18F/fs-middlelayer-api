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
const SUDSConnection = require('./sudsconnection');
const errorUtil = require('./errors/error.js');
const fileStore = require('./filestore.js');
const util = require('./utility.js');

//*******************************************************************

/** Populates fields at the top level of an application
 * @param  {String} intakeField - field in cnData to get the input value.
 * @param  {Object} cnData - application data from SUDS API
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
 * @param  {Object} cnData - application data from SUDS API
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
 * @param  {Object} cnData - application data from SUDS API
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
 * @param  {Object} cnData - application data from SUDS API
 * @param  {Object} applicationData - data about application, retreived from DB
 * @param  {Object} outputSchema - schema used for GET requests
 * @return {Object} object populated with application data
 */
function copyGenericInfo(cnData, applicationData, outputSchema){

	jsf.option({useDefaultValue:true});
	const schemaData = jsf(outputSchema);
	delete schemaData.id;

	const jsonData = schemaData;
	buildGetResponse(cnData, applicationData, schemaData, jsonData, outputSchema);

	return jsonData;
}

/** Controller for GET routes with only a control number
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Object} controlNumber - controlNumber to retrieve
*/
function getFilesRoute(req, res, controlNumber){
	const controlNumberShort = controlNumber.substr(0, controlNumber.length - 6);
	db.getApplication(controlNumberShort)
		.then((fileData) => {
			fileStore.getFilesZip(controlNumberShort, fileData.files, res);
		})
		.catch((error) => {
			errorUtil.getErrorHandle(req, res, error);
		});
}

function getSUDSPostProcess(req, res, applicationDataFromSUDS, controlNumber, reqData) {
	const pathData = reqData.schema;

	const fileTypes = {
		'gud': 'guideDocumentation',
		'arf': 'acknowledgementOfRiskForm',
		'inc': 'insuranceCertificate',
		'gse': 'goodStandingEvidence',
		'opp': 'operatingPlan'
	};

	db.getApplication(controlNumber)
		.then((localApplicationData) => {
			localApplicationData.files.forEach(function (file) {
				const fileType = fileTypes[file.fileType];
				localApplicationData.application[fileType] = file.fileName;
			});

			const responseData = copyGenericInfo(applicationDataFromSUDS,
				localApplicationData.application,
				pathData['x-getTemplate']
			);

			responseData.controlNumber = controlNumber;
			responseData.status = 'success';
			util.logControllerAction(req, 'get.getSUDSPostProcess');
			res.json(responseData);
		})
		.catch((error) => {
			errorUtil.getErrorHandle(req, res, error);
		});
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
function getByControlNumber(req, res, reqData) {
	const controlNumber = reqData.matches.controlNumber;
	const reqPath = `/${req.params[0]}`;

	if (reqPath.indexOf('/files') !== -1) {
		getFilesRoute(req, res, reqData);
	}
	else {
		SUDSConnection.get(req, res, controlNumber)
		.then((applicationDataFromSUDS) => {
			getSUDSPostProcess(req, res, applicationDataFromSUDS, controlNumber, reqData);
		})
		.catch((error) => {
			errorUtil.getErrorHandle(req, res, error);
		});
	}
}

module.exports.getByControlNumber = getByControlNumber;
