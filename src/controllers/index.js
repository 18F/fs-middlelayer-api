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

const errorUtil = require('./errors/error.js');
const get = require('./get.js');
const fileStore = require('./filestore.js');
const db = require('./db.js');
const SUDSConnection = require('./sudsconnection');
const validation = require('./validation.js');
const util = require('./utility.js');
const DuplicateContactsError = require('./errors/duplicateContactsError.js');
const logger = require('./utility.js').logger;

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
	const validationObject = Validator.validateInput(possbileFiles, req);

	if (validationObject.errorArray.length !== 0){
		return errorUtil.sendError(req, res, 400, validationObject.message, validationObject.errorArray);
	}
	else {
		SUDSConnection.post(req, res, validationObject.routeRequestSchema, body)
		.then((postObject)=>{
			const toStoreInDB = db.getDataToStoreInDB(validationObject.routeRequestSchema, body);
			const controlNumber = postObject.POST['/application'].response.accinstCn;
			toStoreInDB.controlNumber = controlNumber;
			db.saveApplication(toStoreInDB)
			.then((application) =>{
				fileStore.saveAndUploadFiles(possbileFiles, req.files, controlNumber, application)
				.then(() => {
					util.logControllerAction(req, 'index.postApplication', controlNumber);
					const successfulResponse = {
						'status': 'sucess',
						'controlNumber': controlNumber
					};
					return res.json(successfulResponse);
				})
				.catch(() => {
					return errorUtil.sendError(req, res, 500, 'server error saving information.');
				});
			});
		})
		.catch((err) => {
			logger.error('ERROR:', err);
			if (err instanceof DuplicateContactsError) {
				if (err.duplicateContacts) {
					return errorUtil.sendError(req, res, 400, err.duplicateContacts.length + ' duplicate contacts found.', err.duplicateContacts);
				}
				else {
					return errorUtil.sendError(req, res, 400, 'duplicate contacts found.');
				}
			}
			else {
				return errorUtil.sendError(req, res, 500, 'unable to process request.');
			}
		});
	}
}

/**
 * Checks that a route request is a valid method and enpoit
 * @param  {Object} req - User request object
 * @param  {Object} res - Response object
 * @param {string} apiPath - endpoint path of the request
 * @param {String} reqMethod - REST method for the request
 */
function validateRoute(req, res, apiPath, reqMethod) {
	if (!apiPath) {
		return errorUtil.sendError(req, res, 404, 'Invalid endpoint.');
	}

	if (!apiSchema.paths[apiPath][reqMethod]) {
		return errorUtil.sendError(req, res, 405, 'No endpoint method found.');
	}

	if (!apiSchema.paths[apiPath][reqMethod].responses) {
		return errorUtil.sendError(req, res, 500, 'No endpoint responses found.');
	}

	if (!apiSchema.paths[apiPath][reqMethod].responses['200']) {
		return errorUtil.sendError(req, res, 500, 'No endpoint success found.');
	}
	return true;
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

		if (validateRoute(req, res, apiPath, reqMethod)) {
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
					get.getByControlNumber(req, res, reqData);
				}

			}
			else if (reqMethod === 'post') {
				postApplication(req, res, reqData);
			}
		}
	}
	else {
		return errorUtil.sendError(req, res, 404, 'Invalid endpoint.');
	}
}

//*******************************************************************
// exports

module.exports.routeRequest = routeRequest;
