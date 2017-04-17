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

//*************************************************************
// Helper Functions

/** Gets info about an application and returns it.
 * @param  {Object} pathData - All data from swagger for the path that has been run
 * @return {Object} - Data from the basic API about an application 
 */
function getBasicRes(pathData){
	return include(pathData.mockOutput);
}

/** Find the matching route in the routing schema for any request. If one is found, extract the useful information from it and return that information.
 * @param  {Object} apiSchema - The whole routing schema, which contains the route used.
 * @param  {String} reqPath - The path that was requested from the API
 * @return {Object} Object describing the matching route, if any, in the routing schema. The path field contains the matched path listed in the routing schema. The tokens field contains all tokens, listed in the matched path. And the matches field contains the tokens with the values that have been given for them.
 */
function apiSchemaData(apiSchema, reqPath){

	if (apiSchema) {
		for (const k in apiSchema.paths) {

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

/** If body passed in as string, converts it to a JSON object
 * @param  {Object} req - request object
 * @return {Object} - request body as a JSON Object
 */
function getBody(req){
	let inputPost = req.body;
	if (inputPost.body) {
		inputPost = JSON.parse(inputPost.body);
	}
	return inputPost;
}

/** Saves all information for a file upload to the DB and uploads the file to S3.
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Array} possbileFiles - list of all files that can be uploaded for this permit type
 * @param  {[type]} files - Files being uploaded and saved
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
				db.saveFile(application.id, fileInfo, function(err){
					if (err){
						return error.sendError(req, res, 500, `${fileInfo.filetype} failed to save`);
					}
					else {
						store.uploadFile(fileInfo, callback);
					}
				});
			}
			else {
				return callback (null, null);
			}
		});
	});
	async.parallel(asyncTasks, function(err, data){
		if (err){
			return callback(err, null);
		}
		else {
			return callback(null, data);
		}
	});
}

//*******************************************************************
// controller functions

const getControlNumberFileName = function(req, res, reqData) {

	const controlNumber = reqData.matches.controlNumber;
	const fileName = reqData.matches.fileName;

	const filePath = controlNumber + '/' + fileName;

	db.getFile(filePath, function (err, file){

		if (err){
			error.sendError(req, res, 500, 'cannot process the request');	
		}
		else {
			if (file){

				store.getFile(controlNumber, fileName, function(err, data){

					if (err){
						error.sendError(req, res, 404, 'file not found');
					}
					else {
						res.attachment(file.file_name);
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

const getControlNumber = function(req, res, reqData){
	const pathData = reqData.schema;
	const fileTypes = {
		'gud': 'guideDocumentation',
		'arf': 'acknowledgementOfRiskForm',
		'inc': 'insuranceCertificate',
		'gse': 'goodStandingEvidence',
		'opp': 'operatingPlan'
	};

	const basicData = getBasicRes(pathData);

	let jsonData = {};

	const controlNumber = reqData.matches.controlNumber;

	const jsonResponse = {};
	jsonResponse.success = true;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = req.method;
	jsonResponse.src = 'json';
	jsonResponse.route = req.originalUrl;

	const cnData = basicData[1095010356];  // TODO: remove - used for mocks

	if (basicData){
		db.getApplication(controlNumber, function(err, appl, fileData){
			if (err){
				return error.sendError(req, res, 404, 'file not found');
			}
			else {
				if (fileData){
					fileData.forEach(function(file){
						const fileType = fileTypes[file.file_type];
						appl[fileType] = file.file_name;
					});
				}
				jsonData = get.copyGenericInfo(cnData, appl, jsonData, pathData.getTemplate);
				jsonData.controlNumber = controlNumber;// TODO: remove - used for mocks
				const toReturn = Object.assign({}, {response:jsonResponse}, jsonData);

				res.json(toReturn);
			}
		});
	}

};

//*************************************************************

const postApplication = function(req, res, reqData){
	const pathData = reqData.schema;

	const body = getBody(req);
	const derefFunc = deref();
	const possbileFiles = [];

	const schema = validation.getValidationSchema(pathData);
	const sch = derefFunc(schema.schemaToUse, [schema.fullSchema]);
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
		const toStoreInDB = db.getDataToStoreInDB(sch, body);

		const controlNumber = (Math.floor((Math.random() * 10000000000) + 1)).toString(); //TODO: remove - used for mocks
		toStoreInDB.control_number = controlNumber;
		db.saveApplication(controlNumber, toStoreInDB, function(err, appl){
			if (err){
				return error.sendError(req, res, 500, 'cannot process the request');
			}
			else {
				saveAndUploadFiles(req, res, possbileFiles, req.files, controlNumber, appl, function(err, data){
					if (err) {
						return error.sendError(req, res, 500, 'cannot process the request');
					}
					else {

						basic.postToBasic(req, res, sch, body, controlNumber);
						
					}
				});
			}
		});
	}
};

const use = function(req, res){

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

module.exports.use = use;

