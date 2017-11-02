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
const request = require('request-promise');

//*******************************************************************
// other files


const db = require('../db.js');
const error = require('../errors/error.js');
const DuplicateContactsError = require('../errors/duplicateContactsError.js');

const auth = require('./auth');
const autoPopulate = require('./autoPopulate.js');

//*******************************************************************


/**
 * Returns whether application is for an individual.
 * @param  {Object}  body - User input
 * @return {Boolean}      - Whether application is for an individual
 */
function isAppFromPerson(body){
	const output = (!body.applicantInfo.orgType || body.applicantInfo.orgType.toUpperCase() === 'PERSON');
	return output;
}

/**
 * Gets the data from all fields that are to be send to the basic API, also builds post object, used to pass data to basic api
 * @param  {Array} fieldsToBasic - All fields in object form which will be sent to basicAPI
 * @param  {Object} body - user input
 * @param  {Object} autoPopValues - All values which have been auto-populated
 * @return {Object} - Array of post objects
 */
function getBasicFields(fieldsToBasic, body, autoPopValues){
	const postObjs = {}, requestsObj = {};
	fieldsToBasic.forEach((field)=>{
		const key = Object.keys(field)[0];
		const whereToStore = field[key].store;
		//whereToStore is where the field needs to be stored, either basic or middlelayer
		whereToStore.forEach((location)=>{
			const requestToUse = location.split(':')[1];
			if (location.split(':')[0] === 'basic'){
				let postObjExists = false;
				for (const request in requestsObj){
					if (request === requestToUse){
						postObjExists = true;
						requestsObj[requestToUse][key] = field[key];
					}
				}
				if (!postObjExists){
					requestsObj[requestToUse] = {};
					requestsObj[requestToUse][key] = field[key];
				}
			}
		});
	});
	//requestsObj contains objects, labeled as each request that may be sent to the basic API, containing the fields
	//which need to be included in that request
	for (const request in requestsObj){
		if (requestsObj.hasOwnProperty(request)){
			const obj = {};
			obj[request] = {};
			for (const fieldKey in requestsObj[request]){
				if (requestsObj[request].hasOwnProperty(fieldKey)){
					const field = requestsObj[request][fieldKey];
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
						obj[request][field.basicField] = bodyField;
					}
					else {
						if (autoPopValues[fieldKey]){
							obj[request][field.basicField] = autoPopValues[fieldKey];
						}
						else {
							obj[request][field.basicField] = field.default;
						}
					}
				}
			}
			postObjs[request] = obj[request];
		}
	}
	return postObjs;
}

/** Takes fields to be stored, creates post objects and populated with user input
 * @param  {Object} validationSchema - validation schema for this request
 * @param  {Object} body - user input
 * @param  {Boolean} person - whether application is for individual(true) or organization (false)
 * @return {Object} - All post objects
 */
function prepareBasicPost(validationSchema, body, person){
	const otherFields = [];
	db.getFieldsToStore(validationSchema, otherFields, '', 'basic');
	const autoPopulateValues = autoPopulate.buildAutoPopulatedFields(otherFields, person, body);
	const fieldsToPost = getBasicFields(otherFields, body, autoPopulateValues);
	return fieldsToPost;
}

/**
 * Creates request for Basic API calls to create contact
 * @param  {Object} res         - Response of previous request
 * @param  {Object} apiCallsObject  - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @param  {Object} fieldsObj   - Object containing post objects to be sent to basic api
 * @param  {String} responseKey - Key in apiCallsObject for the response object of the previous request
 * @param  {String} requestKey  - Key in apiCallsObject for the request object of this request
 * @param  {String} requestPath - Path from basic API route this response needs to be sent to
 * @return {Promise}            - Promise to be fulfilled
 */
function postRequest(res, apiCallsObject, fieldsObj, responseKey, requestKey, requestPath, sudsToken){
	apiCallsObject.POST[responseKey].response = res;
	const addressField = fieldsObj[requestKey];
	addressField.contCn = res.contCn;
	const addressURL = `${auth.SUDS_API_URL}${requestPath}`;
	apiCallsObject.POST[requestPath].request = addressField;
	const createAddressOptions = auth.getRequestOptions(addressURL, 'POST', addressField, sudsToken);
	return request.post(createAddressOptions);
}
/**
 * Calls basic API to create a contact in SUDS
 * @param  {Object} fieldsObj  - Object containing post objects to be sent to basic api
 * @param  {boolean} person    - Boolean indicating whether the contract being created is for a person or not
 * @param  {Object} apiCallsObject - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @return {Promise}		   - Promise to be fulfilled
 */
function createContact(fieldsObj, person, apiCallsObject, sudsToken){
	return new Promise(function(fulfill, reject){
		let contactField, createPersonOrOrgURL, responseKey;
		if (person){
			contactField = fieldsObj['/contact/person'];
			createPersonOrOrgURL = `${auth.SUDS_API_URL}/contact/person`;
			responseKey = '/contact/person';
			apiCallsObject.POST[responseKey].request = contactField;
		}
		else {
			contactField = fieldsObj['/contact/organization'];
			createPersonOrOrgURL = `${auth.SUDS_API_URL}/contact/organization`;
			responseKey = '/contact/orgcode';
			apiCallsObject.POST[responseKey].request = contactField;
		}
		const createContactOptions = auth.getRequestOptions(createPersonOrOrgURL, 'POST', contactField, sudsToken);
		request.post(createContactOptions)
		.then(function(res){
			return postRequest(res, apiCallsObject, fieldsObj, responseKey, '/contact/address', '/contact-address', sudsToken);
		})
		.then(function(res){
			return postRequest(res, apiCallsObject, fieldsObj, '/contact-address', '/contact/phone', '/contact-phone', sudsToken);
		})
		.then(function(res){
			apiCallsObject.POST['/contact-phone'].response = res;
			fulfill(res.contCn);
		})
		.catch(function(err){
			reject(err);
		});
	});
}

/**
 * Calls basic API to create an application in SUDS
 * @param  {Object} fieldsObj   - Object containing post objects to be sent to basic api
 * @param  {Number} contCN      - Contact control number of contact associated with this application
 * @param  {Object} apiCallsObject  - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @return {Promise}            - Promise to be fulfilled
 */
function createApplication(fieldsObj, contCN, apiCallsObject, sudsToken){
	const createApplicationURL = `${auth.SUDS_API_URL}/application`;
	fieldsObj['/application'].contCn = contCN;
	const applicationPost = fieldsObj['/application'];
	apiCallsObject.POST['/application'].request = applicationPost;
	const createApplicationOptions = auth.getRequestOptions(createApplicationURL, 'POST', applicationPost, sudsToken);
	return request.post(createApplicationOptions);
}

/**
 * Gets the contId to be used if a contact is created so it can be compared to the results of the contact GET request
 * @param  {Object} fieldsObj - Object containing post objects to be sent to basic api
 * @param  {Boolean} person   - Whether the application is for a person or not
 * @return {String}           - ContId for this application
 */
function getContId(fieldsObj, person){
	if (person){
		return fieldsObj['/contact/person'].contId;
	}
	else {
		return fieldsObj['/contact/organization'].contId;
	}
}

/** Sends requests needed to create an application via the Basic API
 * @param  {Object} req - Request Object
 * @param  {Object} res - Response Object
 * @param  {Object} validationSchema - Schema object
 * @param  {Object} body - User input
 */
function postToBasic(req, res, validationSchema, body){

	return new Promise(function (fulfill, reject){

		auth.getToken()
		.then(function(sudsToken) {
			const apiCallsObject = {
				'GET':{
					'/contact/lastname/{lastName}':{},
					'/contact/orgcode/{orgCode}':{}
				},
				'POST':{
					'/contact/person':{},
					'/contact/orgcode':{},
					'/contact-address':{},
					'/contact-phone':{},
					'/application':{}
				}
			};

			const person = isAppFromPerson(body);
			const fieldsObj = prepareBasicPost(validationSchema, body, person);
			let existingContactCheck;
			if (person){
				const lastName = body.applicantInfo.lastName;
				existingContactCheck = `${auth.SUDS_API_URL}/contact/lastname/${lastName}`;
				apiCallsObject.GET['/contact/lastname/{lastName}'].request = {'lastName':lastName};
			}
			else {
				const orgName = body.applicantInfo.organizationName;
				existingContactCheck = `${auth.SUDS_API_URL}/contact/orgcode/${orgName}`;
				apiCallsObject.GET['/contact/orgcode/{orgCode}'].request = {'orgCode':orgName};
			}
			const getContactOptions = auth.getRequestOptions(existingContactCheck, 'GET', null, sudsToken);

			request.get(getContactOptions)
			.then(function(res){
				if (person){
					apiCallsObject.GET['/contact/lastname/{lastName}'].response = res;
				}
				else {
					apiCallsObject.GET['/contact/orgcode/{orgCode}'].response = res;
				}
				const contId = getContId(fieldsObj, person);
				if (res.length === 1  && res[0].contCn){
					if (contId === res[0].contId){
						return new Promise(function(resolve){
							resolve(res[0].contCn);
						});
					}
					else {
						return createContact(fieldsObj, person, apiCallsObject, sudsToken);
					}
				}
				else if (res.length > 1){
					const matchingContacts = res;
					const duplicateContacts = [];
					let tmpContCn;

					matchingContacts.forEach((contact)=>{
						if (contId === contact.contId){
							duplicateContacts.push(contact);
							tmpContCn = contact.contCn;
						}
					});

					if (duplicateContacts.length === 0){
						return createContact(fieldsObj, person, apiCallsObject, sudsToken);
					}
					else if (duplicateContacts.length === 1){
						return new Promise(function(resolve){
							resolve(tmpContCn);
						});
					}
					else {
						throw new DuplicateContactsError(duplicateContacts);
					}
				}
				else {
					return createContact(fieldsObj, person, apiCallsObject, sudsToken);
				}
			})
			.then(function(contCn){
				return createApplication(fieldsObj, contCn, apiCallsObject, sudsToken);
			})
			.then(function(response){
				const applResponse  = response;
				apiCallsObject.POST['/application'].response = applResponse;
				fulfill(apiCallsObject);
			})
			.catch(function(err){
				if (err.statusCode && err.statusCode === 404){
					console.error(err);
					return error.sendError(req, res, 503, 'underlying service unavailable.');
				}
				else if (err.error && err.error.code === 'ETIMEDOUT') {
					console.error(err);
					return error.sendError(req, res, 504, 'underlying service has timed out.');
				}
				else {
					reject(err);
				}
			});
		})
		.catch(reject);
	});

}

module.exports.postToBasic = postToBasic;
