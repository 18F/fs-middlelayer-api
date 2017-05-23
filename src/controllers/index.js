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
const async = require('async');
const deref = require('deref');
const matchstick = require('matchstick');

const apiSchema = include('src/api.json');

//*******************************************************************
// other files

const error = require('./error.js');
const get = require('./get.js');
const store = require('./store.js');
const db = require('./db.js');
const basic = require('./basic.js');
const validation = require('./validation.js');
const util = require('./utility.js');
const DuplicateContactsError = require('./duplicateContactsError.js');

//*************************************************************
// Helper Functions

/** Find the matching route in the routing schema for any request. If one is found, extract the useful information from it and return that information.
 * @param  {Object} apiSchema - The whole routing schema, which contains the route used.
 * @param  {String} reqPath - The path that was requested from the API
 * @return {Object} Object describing the matching route, if any, in the routing schema. The path field contains the matched path listed in the routing schema. The tokens field contains all tokens, listed in the matched path. And the matches field contains the tokens with the values that have been given for them.
 */
function apiSchemaData(apiSchema, reqPath){

	if (apiSchema) {
		for (const k in apiSchema.paths) {

			if (apiSchema.paths.hasOwnProperty(k)){

				const ms = matchstick(k, 'template');
				ms.match(reqPath);

				if ( ms.match(reqPath) ) { 

					return {
						path: k,
						tokens: ms.tokens,
						matches: ms.matches
					};
				}	
			}
		}
	}

}

/** Saves all information for a file upload to the DB and uploads the file to S3.
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Array} possbileFiles - list of all files that can be uploaded for this permit type
 * @param  {Array} files - Files being uploaded and saved
 * @param  {String} controlNumber - Control number of the application being processed
 * @param  {Object} application - Body of application being submitted
 * @param  {Function} callback - Function to be called after attempting to save the files.
 */
function saveAndUploadFiles(req, res, possbileFiles, files, controlNumber, application, callback){

	const asyncTasks = [];

	possbileFiles.forEach((fileConstraints)=>{

		asyncTasks.push(function(callback){

			const key = Object.keys(fileConstraints)[0];
			if (files[key]){
				const fileInfo = validation.getFileInfo(files[key], fileConstraints);
				fileInfo.keyname = `${controlNumber}/${fileInfo.filename}`;
				store.uploadFile(fileInfo, function(err){
					if (err){
						console.error(err);
						return error.sendError(req, res, 500, 'unable to process request.');
					}
					else {
						db.saveFile(application.id, fileInfo, function(err){
							if (err){
								console.error(err);
								return error.sendError(req, res, 500, 'unable to process request.');
							}
							else {
								return callback (null);
							}
						});	
					}
				});
			}
			else {
				return callback (null);
			}
		});
	});
	async.parallel(asyncTasks, function(err, data){
		if (err){
			return callback (err);
		}
		else {
			return callback (null);
		}
	});
}

//*******************************************************************
// controller functions

/** Controller for GET routes with a control number and a file name
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Object} reqData - Object containing information about the request and the route requested
 * @param  {String} reqData.path - Path being requested
 * @param  {Array} reqData.tokens - Array of all tokens present in path being requested 
 * @param  {Object} reqData.matches - Object with key pair values of all tokens present in the request
 * @param  {Object} reqData.schema - Schema of the route requested
 */
const getControlNumberFileName = function(req, res, reqData) {

	const controlNumber = reqData.matches.controlNumber;
	const fileName = reqData.matches.fileName;

	const filePath = controlNumber + '/' + fileName;

	db.getFile(filePath, function (err, file){

		if (err){
			console.error(err);
			error.sendError(req, res, 500, 'unable to process request.');	
		}
		else {
			if (file){

				store.getFile(controlNumber, fileName, function(err, data){

					if (err){
						console.error(err);
						error.sendError(req, res, 404, 'file not found');
					}
					else {
						res.attachment(file.fileName);
						res.send(data.Body);	
					}

				});
			}
			else {
				error.sendError(req, res, 404, 'file not found');
			}
		}
	});
	
};

/** Controller for GET routes with only a control number
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Object} reqData - Object containing information about the request and the route requested
 * @param  {String} reqData.path - Path being requested
 * @param  {Array} reqData.tokens - Array of all tokens present in path being requested 
 * @param  {Object} reqData.matches - Object with key pair values of all tokens present in the request
 * @param  {Object} reqData.schema - Schema of the route requested
 */
const getControlNumber = function(req, res, reqData){
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
				return error.sendError(req, res, 500, 'unable to process request.');	
			}

			else if (fileData){

				store.getFilesZip(controlNumber, fileData, res, function(err){

					if (err){
						error.sendError(req, res, 404, 'file not found');
					}			

				});	
				
			}
			else {
				error.sendError(req, res, 404, 'file not found');	
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
						return error.sendError(req, res, 500, 'unable to process request.');
					}
					else {
						
						if (!appl){
							return error.sendError(req, res, 404, 'file not found.');		
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

};

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
const postApplication = function(req, res, reqData){

	const pathData = reqData.schema;

	const body = util.getBody(req);
	const derefFunc = deref();
	const possbileFiles = [];

	const schema = validation.getValidationSchema(pathData);
	const sch = derefFunc(schema.schemaToUse, [schema.fullSchema], true);
	const allErrors = validation.getFieldValidationErrors(body, pathData, sch);
	
	//Files to validate are in possbileFiles
	validation.checkForFilesInSchema(sch, possbileFiles);

	if (possbileFiles.length !== 0){
		possbileFiles.forEach((fileConstraints)=>{
			const key = Object.keys(fileConstraints)[0];
			const fileValidationErrors = validation.validateFile(req.files[key], fileConstraints, key);
			allErrors.errorArray = allErrors.errorArray.concat(fileValidationErrors);
		});
	}
	const errorMessage = validation.generateErrorMesage(allErrors);
	if (allErrors.errorArray.length !== 0){
		return error.sendError(req, res, 400, errorMessage, allErrors.errorArray);
	}
	else {
		basic.postToBasic(req, res, sch, body)
		.then((postObject)=>{
			const toStoreInDB = db.getDataToStoreInDB(sch, body);
			const controlNumber = postObject.POST['/application'].response.accinstCn;
			toStoreInDB.controlNumber = controlNumber;
			db.saveApplication(toStoreInDB, function(err, appl){
				if (err){
					console.error(err);
					return error.sendError(req, res, 500, 'unable to process request.');
				}
				else {
					saveAndUploadFiles(req, res, possbileFiles, req.files, controlNumber, appl, function(err){
						if (err) {
							console.error(err);
							return error.sendError(req, res, 500, 'unable to process request.');
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
};

/**
 * Takes in request and calls functions based on what route was called
 * @param  {Object} req - User request object
 * @param  {Object} res - Response object
 */
const routeRequest = function(req, res){

	const reqPath = `/${req.params[0]}`;
	const reqMethod = req.method.toLowerCase();

	const apiReqData = apiSchemaData(apiSchema, reqPath);
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

								getControlNumberFileName(req, res, reqData);

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
};

//*******************************************************************
// exports

module.exports.routeRequest = routeRequest;

