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
const apiSchema = include('src/api.json');

//*******************************************************************
// other files

const error = require('./errors/error.js');
const get = require('./get.js');
const fileStore = require('./fileStore.js');
const db = require('./db.js');
const NRMConnection = require('./nrmconnection');
const validation = require('./validation.js');
const util = require('./utility.js');
const DuplicateContactsError = require('./errors/duplicateContactsError.js');

//*******************************************************************
// controller functions

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
	const possbileFiles = [];

	const Validator = new validation.ValidationClass(pathData, body);
	const errorObject = Validator.validateInput(possbileFiles, req);

	if (errorObject.errorArray.length !== 0){
		return error.sendError(req, res, 400, errorObject.message, errorObject.errorArray);
	}
	else {
		NRMConnection.postToBasic(req, res, errorObject.routeRequestSchema, body)
		.then((postObject)=>{
			const toStoreInDB = db.getDataToStoreInDB(errorObject.routeRequestSchema, body);
			const controlNumber = postObject.POST['/application'].response.accinstCn;
			toStoreInDB.controlNumber = controlNumber;
			db.saveApplication(toStoreInDB, function(err, appl){
				if (err){
					console.error(err);
					return error.sendError(req, res, 500, 'error while saving application in the database.');
				}
				else {
					fileStore.saveAndUploadFiles(req, res, possbileFiles, req.files, controlNumber, appl, function(err){
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

								fileStore.getControlNumberFileName(req, res, reqData);

							}
							else {

								get.getControlNumber(req, res, reqData);
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
