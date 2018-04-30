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

const include = require('include')(__dirname);
const deref = require('deref');
const apiSchema = include('src/api.json');

//*******************************************************************
// other files

const error = require('./errors/error.js');
const get = require('./get.js');
const filestore = require('./filestore.js');
const db = require('./db.js');
const basic = require('./nrmconnection');
const validation = require('./validation.js');
const fileValidation = require('./fileValidation.js');
const util = require('./utility.js');
const DuplicateContactsError = require('./errors/duplicateContactsError.js');

//*******************************************************************
// controller functions

/** Controller for GET routes with only a control number
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Object} reqData - Object containing information about the request and the route requested
 * @param  {String} reqData.path - Path being requested
 * @param  {Array} reqData.tokens - Array of all tokens present in path being requested
 * @param  {Object} reqData.matches - Object with key pair values of all tokens present in the request
 * @param  {Object} reqData.schema - Schema of the route requested
 */
function getControlNumber(req, res, reqData){
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

		db.getApplication(controlNumber, function(err, appl, fileData){

			if (err) {
				console.error(err);
				return error.sendError(req, res, 500, 'error while getting application from the database.');
			}

			else if (fileData){

				filestore.getFilesZip(controlNumber, fileData, res);

			}
			else {
				error.sendError(req, res, 404, 'file not found in the database.');
			}

		});

	}
	else {

		let basicData = {};
		basic.getFromBasic(req, res, reqData.matches.controlNumber)
		.then((appData)=>{
			basicData = appData;

			let jsonData = {};

			const controlNumber = reqData.matches.controlNumber;

			const jsonResponse = {};

			const cnData = basicData;

			if (basicData){

				db.getApplication(controlNumber, function(err, appl, fileData){
					if (err){
						console.error(err);
						return error.sendError(req, res, 500, 'error while getting application from the database.');
					}
					else {

						if (!appl){
							return error.sendError(req, res, 404, 'application not found in the database.');
						}
						else if (fileData){
							fileData.forEach(function(file){
								const fileType = fileTypes[file.fileType];
								appl[fileType] = file.fileName;
							});
						}
						jsonData = get.copyGenericInfo(cnData, appl, jsonData, pathData['x-getTemplate']);
						jsonData.controlNumber = controlNumber;

						jsonResponse.status = 'success';
						const toReturn = Object.assign({}, jsonResponse, jsonData);

						res.json(toReturn);
					}
				});
			}
		})
		.catch((err)=>{
			console.error(err);
			return error.sendError(req, res, 500, 'unable to process request.');
		});

	}

}

//*************************************************************

/** Controller for POST routes
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Object} reqData - Object containing information about the request and the route requested
 * @param  {String} reqData.path - Path being requested
 * @param  {Array} reqData.tokens - Array of all tokens present in path being requested
 * @param  {Object} reqData.matches - Object with key pair values of all tokens present in the request
 * @param  {Object} reqData.schema - Schema of the route requested
 */
function postApplication(req, res, reqData){

	const pathData = reqData.schema;

	const body = util.getBody(req);
	const derefFunc = deref();
	console.log(body);
	const possbileFiles = [];

	const validationSchema = validation.selectValidationSchema(pathData);
	const routeRequestSchema = derefFunc(validationSchema.schemaToUse, [validationSchema.fullSchema], true);
	const allErrors = validation.getFieldValidationErrors(body, pathData, routeRequestSchema);
	
	//Files to validate are in possbileFiles
	fileValidation.checkForFilesInSchema(routeRequestSchema, possbileFiles);

	if (possbileFiles.length !== 0){
		possbileFiles.forEach((fileConstraints)=>{
			const key = Object.keys(fileConstraints)[0];
			const fileValidationErrors = fileValidation.validateFile(req.files[key], fileConstraints, key);
			allErrors.errorArray = allErrors.errorArray.concat(fileValidationErrors);
		});
	}
	const errorMessage = validation.generateErrorMesage(allErrors);
	if (allErrors.errorArray.length !== 0){
		return error.sendError(req, res, 400, errorMessage, allErrors.errorArray);
	}
	else {
		basic.postToBasic(req, res, routeRequestSchema, body)
		.then((postObject)=>{
			const toStoreInDB = db.getDataToStoreInDB(routeRequestSchema, body);
			const controlNumber = postObject.POST['/application'].response.accinstCn;
			toStoreInDB.controlNumber = controlNumber;
			db.saveApplication(toStoreInDB, function(err, appl){
				if (err){
					console.error(err);
					return error.sendError(req, res, 500, 'error while saving application in the database.');
				}
				else {
					filestore.saveAndUploadFiles(req, res, possbileFiles, req.files, controlNumber, appl, function(err){
						if (err) {
							console.error(err);
							return error.sendError(req, res, 500, 'error while uploading files.');
						}
						else {

							const jsonResponse = {};
							jsonResponse.status = 'success';
							jsonResponse.controlNumber = controlNumber;
							console.log(JSON.stringify(postObject, null, 4));
							return res.json(jsonResponse);

						}
					});
				}
			});
		})
		.catch((err)=>{

			console.error(err);
			if (err instanceof DuplicateContactsError){
				if (err.duplicateContacts){
					return error.sendError(req, res, 400, err.duplicateContacts.length + ' duplicate contacts found.', err.duplicateContacts);
				}
				else {
					return error.sendError(req, res, 400, 'duplicate contacts found.');
				}
			}
			else {
				return error.sendError(req, res, 500, 'unable to process request.');
			}
		});
	}
}

/**
 * Takes in request and calls functions based on what route was called
 * @param  {Object} req - User request object
 * @param  {Object} res - Response object
 */
function routeRequest(req, res){

	const reqPath = `/${req.params[0]}`;
	const reqMethod = req.method.toLowerCase();

	const apiReqData = util.apiSchemaData(apiSchema, reqPath);
	if (apiReqData){
		const apiPath = apiReqData.path;
		const apiTokens = apiReqData.tokens;
		const apiMatches = apiReqData.matches;

		if (!apiPath) {
			return error.sendError(req, res, 404, 'Invalid endpoint.');
		}
		else {
			if (!apiSchema.paths[apiPath][reqMethod]) {
				return error.sendError(req, res, 405, 'No endpoint method found.');
			}
			else {
				if (!apiSchema.paths[apiPath][reqMethod].responses) {
					return error.sendError(req, res, 500, 'No endpoint responses found.');
				}
				else {
					if (!apiSchema.paths[apiPath][reqMethod].responses['200']) {
						return error.sendError(req, res, 500, 'No endpoint success found.');
					}
					else {

						const schemaData = apiSchema.paths[apiPath][reqMethod];

						const reqData = {
							path: apiPath,
							tokens: apiTokens,
							matches: apiMatches,
							schema: schemaData
						};

						if (reqMethod === 'get') {
							if (apiTokens.includes('fileName')) {

								filestore.getControlNumberFileName(req, res, reqData);

							}
							else {

								getControlNumber(req, res, reqData);
							}

						}
						else if (reqMethod === 'post') {
							postApplication(req, res, reqData);
						}

					}
				}
			}
		}
	}
	else {
		return error.sendError(req, res, 404, 'Invalid endpoint.');
	}
}

//*******************************************************************
// exports

module.exports.routeRequest = routeRequest;
