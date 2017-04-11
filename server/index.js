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
const request = require('request-promise');
const deref = require('deref');
const matchstick = require('matchstick');

const apiSchema = include('server/swagger.json');

//*******************************************************************
// other files

const error = require('./error.js');
const dbUtil = require('./dbUtil.js');
const util = require('./util.js');
const aws = require('./aws.js');
const db = require('./db.js');
const validation = require('./validation.js');

const basicURL = process.env.BASICURL;

//*******************************************************************
// controller

const use = function(req, res){

	const reqPath = `/${req.params[0]}`;
	const reqMethod = req.method.toLowerCase();

	//console.log('reqPath: ' + reqPath);
	//console.log('reqMethod: ' + reqMethod);

	console.log('\n apiSchemaData(apiSchema, reqPath) : ' + JSON.stringify(apiSchemaData(apiSchema, reqPath)));

	const apiReqData = apiSchemaData(apiSchema, reqPath);	//Need to handle if this is undefined
	const apiPath = apiReqData.path;
	const apiTokens = apiReqData.tokens;
	const apiMatches = apiReqData.matches;

	console.log('\n apiTokens : ' + JSON.stringify(apiTokens));
	console.log('\n apiMatches : ' + JSON.stringify(apiMatches));

	console.log('reqPath : ' + reqPath );
	console.log('reqMethod : ' + reqMethod );
	console.log('apiPath : ' + apiPath );

	if (!apiPath) {
		return error.sendError(req, res, 404, 'Invalid endpoint.');
	}
	else {
		//console.log('apiPath true : ' + apiPath );
		if (!apiSchema.paths[apiPath][reqMethod]) {
			return error.sendError(req, res, 405, 'No endpoint method found.');
		}
		else {
			//console.log('reqMethod true : ' + reqMethod );
			if (!apiSchema.paths[apiPath][reqMethod].responses) {
				return error.sendError(req, res, 500, 'No endpoint responses found.');
			}
			else {
				//console.log('response true : ' + JSON.stringify(apiSchema.paths[apiPath][reqMethod].responses) );
				if (!apiSchema.paths[apiPath][reqMethod].responses['200']) {
					return error.sendError(req, res, 500, 'No endpoint success found.');
				}
				else {
					
					const schemaData = apiSchema.paths[apiPath][reqMethod];

					console.log('schemaData : ' + JSON.stringify(schemaData) );

					const reqData = {
						path: apiPath,
						tokens: apiTokens,
						matches: apiMatches,
						schema: schemaData
					};

					if (reqMethod === 'get') {

						if (apiTokens.includes('fileName')) {
							console.log('apiTokens true');

							getControlNumberFileName(req, res, schemaData);

						}
						else {
			
							getControlNumber(req, res, schemaData);
						}

					}
					else if (reqMethod === 'post') {
						postApplication(req, res, schemaData);
					}
	
				}
			}
		}
	}
};

//*************************************************************

const getControlNumberFileName = function(req, res, pathData) {
	console.log('getControlNumberFileName ' );

	res.json('hello');
	
};

const getControlNumber = function(req, res, pathData){
	console.log('getControlNumber ' );

	const basicData = getBasicRes(pathData);

	let jsonData = {};

	const controlNumber = req.params.id;

	const jsonResponse = {};
	jsonResponse.success = true;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = req.method;
	jsonResponse.src = 'json';
	jsonResponse.route = req.originalUrl;

	const cnData = basicData[1095010356];  // TODO: remove - used for mocks

	if (basicData){
		dbUtil.getApplication(controlNumber, function(err, appl){
			if (err){
				return error.sendError(req, res, 400, 'error getting application from database');
			}
			else {
				jsonData = util.copyGenericInfo(cnData, appl, jsonData, pathData.getTemplate);
				const toReturn = Object.assign({}, {response:jsonResponse}, jsonData);

				res.json(toReturn);
			}
		});
	}

};

//*************************************************************

const postApplication = function(req, res, pathData){
	console.log('postApplication ' );

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

		const controlNumber = Math.floor((Math.random() * 10000000000) + 1); //TODO: remove - used for mocks
		toStoreInDB.control_number = controlNumber;
		dbUtil.saveApplication(controlNumber, toStoreInDB, function(err, appl){
			if (err){
				return error.sendError(req, res, 500, err);
			}
			else {
				saveAndUploadFiles(req, res, possbileFiles, req.files, controlNumber, appl, function(err, data){
					if (err) {
						return error.sendError(req, res, 500, err);
					}
					else {

						postToBasic(req, res, sch, body);
						
					}
				});
			}
		});
	}
};

//*************************************************************

function getBasicRes(pathData){
	return include(pathData.mockOutput);
}

function apiSchemaData(apiSchema, reqPath){

	if (apiSchema) {
		for (const k in apiSchema.paths) {
			//console.log('\nk : ' + JSON.stringify(k) );

			const ms = matchstick(k, 'template');
			//console.log('ms : ' + JSON.stringify(ms) );
			ms.match(reqPath);

			if ( ms.match(reqPath) ) { 

				console.log('ms.tokens : ' + JSON.stringify(ms.tokens) );
				console.log('ms.match : ' + JSON.stringify(ms.match(reqPath)) );
				console.log('ms.matches : ' + JSON.stringify(ms.matches ) );

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
						aws.uploadFile(fileInfo, callback);
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

/** Finds basic API fields are to be auto-populated
 * @param  {Array[Object]} basicFields - Fields which are stored in SUDS
 * @return {Array[Object]} - Fields which are to be auto-populated
 */
function getAutoPopulatedFields(basicFields){
	const autoPop = [];
	basicFields.forEach((field)=>{
		const key = Object.keys(field)[0];
		if (!field[key].fromIntake && field[key].madeOf){
			autoPop.push(field);
		}
	});
	return autoPop;
}
/** Given list of fields which must be auto-populate, returns values to store
 * @param  {Array[Object]} - Fields which need to be auto-populated
 * @param  {Object} body - user input
 * @return {Array[]} - created values
 */
function buildAutoPopulatedFields(toBuild, body){
	const output = {};
	toBuild.forEach((field)=>{
		const key = Object.keys(field)[0];
		let fieldValue = '';
		field[key].madeOf.forEach((component)=>{
			if (body[component]){
				fieldValue = `${fieldValue}${body[component]}`;
			}
			else {
				fieldValue = `${fieldValue}${component}`;
			}
		});
		output[key] = fieldValue;
	});
	return output;
}
/**
 * @param  {Array[Object]} fields - All fields which will be sent to basicAPI
 * @param  {Object} body - user input
 * @param  {Object} autoPopValues - All values which have been auto-populated
 * @return {Array[Object]} - Array of post objects
 */
function getBasicFields(fields, body, autoPopValues){
	const requests = [], postObjs = [];
	fields.forEach((field)=>{
		const key = Object.keys(field)[0];
		const whereToStore = field[key].store;
		whereToStore.forEach((location)=>{
			const requestToUse = location.split(':')[1];
			if (location.split(':')[0] === 'basic'){
				let postObjExists = false;
				requests.forEach((request)=>{
					const requestKey = Object.keys(request)[0];
					if (requestKey === requestToUse){
						postObjExists = true;
						request[requestToUse][key] = field[key];
					}
				});
				if (!postObjExists){
					const obj = {};
					obj[requestToUse] = {};
					obj[requestToUse][key] = field[key];
					requests.push(obj);
				}
			}
		});
	});
	requests.forEach((request)=>{
		const key = Object.keys(request)[0];
		const obj = {};
		obj[key] = {};
		Object.keys(request[key]).forEach((fieldKey)=>{
			const field = request[key][fieldKey];
			const fieldPath = fieldKey;
			const splitPath = fieldPath.split('.');
			let bodyField = body;
			if (field.fromIntake){
				splitPath.forEach((sp)=>{
					if (bodyField[sp]){
						bodyField = bodyField[sp];
					}
					else {
						bodyField = field.default;
					}
				});
				obj[key][field.basicField] = bodyField;
			}
			else {
				if (autoPopValues[fieldKey]){
					obj[key][field.basicField] = autoPopValues[fieldKey];
				}
				else {
					obj[key][field.basicField] = field.default;
				}
			}
		});
		postObjs.push(obj);
	});
	return postObjs;
}

/** Takes fields to be stored, creates post objects and populated with user input
 * @param  {Object} sch - validation schema for this request
 * @param  {Object} body - user input
 * @return {Array[Object]} - All post objects 
 */
function prepareBasicPost(sch, body){
	const otherFields = [];
	db.getFieldsToStoreInDB(sch, otherFields, '', 'basic');
	const toBuild = getAutoPopulatedFields(otherFields);
	const autoPopulateValues = buildAutoPopulatedFields(toBuild, body);
	const fieldsToPost = getBasicFields(otherFields, body, autoPopulateValues);
	return fieldsToPost;
}

function createContact(fieldsObj, person, postObject){
	return new Promise(function(fulfill, reject){
		let contactField, createPersonOrOrgURL;
		if (person){
			contactField = fieldsObj['/contact/person'];
			createPersonOrOrgURL = `${basicURL}/contact/person/`;
		}
		else {
			contactField = fieldsObj['/contact/organization'];
			createPersonOrOrgURL = `${basicURL}/contact/orgcode/`;
		}
		postObject['/contact/personOrOrgcode'].request = contactField;
		const createContactOptions = {
			method: 'POST',
			uri: createPersonOrOrgURL,
			body: contactField,
			json: true
		};
		request(createContactOptions)
		.then(function(res){
			postObject['/contact/personOrOrgcode'].response = res;
			const cn = res.contCn;
			const addressField = fieldsObj['/contact/address'];
			addressField.contact = cn;
			const addressURL = `${basicURL}/contact-address/`;
			postObject['/contact-address'].request = addressField;
			const createAddressOptions = {
				method: 'POST',
				uri: addressURL,
				body: addressField,
				json: true
			};
			return request(createAddressOptions);
		})
		.then(function(res){
			postObject['/contact-address'].response = res;
			const cn = res.contact;
			const phoneField = fieldsObj['/contact/phone'];
			phoneField.contact = cn;
			const phoneURL = `${basicURL}/contact-phone/`;
			postObject['/contact-phone'].request = phoneField;
			const createPhoneOptions = {
				method: 'POST',
				uri: phoneURL,
				body: phoneField,
				json: true
			};
			return request(createPhoneOptions);
		})
		.then(function(res){
			postObject['/contact-phone'].response = res;
			fulfill(res.contact);
		})
		.catch(function(err){
			reject(err);
		});
	});
}

/** Sends requests needed to create an application via the Basic API
 * @param  {Object} req - Request Object
 * @param  {Object} res - Response Object
 * @param  {Object} sch - Schema object 
 * @param  {Object} body - User input
 */
function postToBasic(req, res, sch, body){

	const postObject = {
		'/contact/personOrOrgcode':{},
		'/contact-address':{},
		'/contact-phone':{},
		'/application':{}
	};
	const fieldsToPost = prepareBasicPost(sch, body);
	const fieldsObj = {};
	fieldsToPost.forEach((post)=>{
		const key = Object.keys(post)[0];
		fieldsObj[key] = post[key];
	});

	const org = (body.applicantInfo.orgType && body.applicantInfo.orgType !== 'Individual');
	let existingContactCheck;
	if (org){
		let orgName = body.applicantInfo.organizationName;
		if (!orgName){
			orgName = 'abc';
		}
		existingContactCheck = `${basicURL}/contact/orgcode/${orgName}/`;
	}
	else {
		const lastName = body.applicantInfo.lastName;
		existingContactCheck = `${basicURL}/contact/person/${lastName}/`;
	}
	
	const getContactOptions = {
		method: 'GET',
		uri: existingContactCheck,
		qs:{},
		json: true
	};
	request(getContactOptions)
	.then(function(res){
		if (res.contCN){
			Promise.resolve(res.contCN);
		}
		else {
			return createContact(fieldsObj, true, postObject);
		}
	})
	.then(function(contCN){
		const createApplicationURL = `${basicURL}/application/`;
		fieldsObj['/application'].contCn = contCN;
		const applicationPost = fieldsObj['/application'];
		postObject['/application'].request = applicationPost;
		const createApplicationOptions = {
			method: 'POST',
			uri: createApplicationURL,
			body: applicationPost,
			json: true
		};
		return request(createApplicationOptions);
	})
	.then(function(response){
		postObject['/application'].response = response;
		const jsonResponse = {};
		jsonResponse.success = true;
		jsonResponse.api = 'FS ePermit API';
		jsonResponse.type = 'controller';
		jsonResponse.verb = req.method;
		jsonResponse.src = 'json';
		jsonResponse.route = req.originalUrl;
		jsonResponse.origReq = body;
		jsonResponse.accinstCn = res.accinstCn;
		jsonResponse.basicPosts = postObject;
		return res.json(jsonResponse);
	})
	.catch(function(err){
		return error.sendError(req, res, 500, err);
	});
}

//*******************************************************************
// exports

module.exports.use = use;

//POST
	//Update basic paths so it matches url

//GET
//Populate object
	//Need to use code to pull from middle layer/S3
