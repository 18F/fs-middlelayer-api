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
const errorUtil = require('../errors/error.js');
const DuplicateContactsError = require('../errors/duplicateContactsError.js');

const auth = require('./auth');
const populate = require('./populateFields.js');

//*******************************************************************

/**
 * Returns whether application is for an individual.
 * @param  {Object}  body - User input
 * @return {Boolean}	  - Whether application is for an individual
 */
function isAppFromPerson(body){
	const output = (!body.applicantInfo.orgType || body.applicantInfo.orgType.toUpperCase() === 'PERSON');
	return output;
}

/**
 * Creates request for Basic API calls to create contact
 * @param  {Object} res		 - Response of previous request
 * @param  {Object} apiCallLogObject  - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @param  {Object} fieldsObj   - Object containing post objects to be sent to basic api
 * @param  {String} responseKey - Key in apiCallLogObject for the response object of the previous request
 * @param  {String} requestKey  - Key in apiCallLogObject for the request object of this request
 * @param  {String} requestPath - Path from basic API route this response needs to be sent to
 * @return {Promise}			- Promise to be fulfilled
 */
function postRequest(res, apiCallLogObject, fieldsObj, responseKey, requestKey, requestPath, sudsToken){
	apiCallLogObject.POST[responseKey].response = res;
	const addressField = fieldsObj[requestKey];
	addressField.contCn = res.contCn;
	const addressURL = `${auth.SUDS_API_URL}${requestPath}`;
	apiCallLogObject.POST[requestPath].request = addressField;
	const createAddressOptions = auth.getRequestOptions(addressURL, 'POST', addressField, sudsToken);
	return request.post(createAddressOptions);
}

/**
 * Gets the data from all fields that are to be send to the basic API, also builds post object, used to pass data to basic api
 * @param  {Array} fieldsToBasic - All fields in object form which will be sent to basicAPI
 * @return {Object} - Array of endpoints with which fields should go in them
 */
function assignFieldsToEndpoints(fieldsToBasic){
	const fieldsAssignedToEndpoints = {};
	fieldsToBasic.forEach((field)=>{
		const key = Object.keys(field)[0];
		if (field[key].hasOwnProperty('sudsEndpoint')){
			field[key].sudsEndpoint.forEach((location)=>{
				if (!fieldsAssignedToEndpoints.hasOwnProperty(location)){
					fieldsAssignedToEndpoints[location] = {};
				}
				fieldsAssignedToEndpoints[location][key] = field[key];
			});
		}
	});
	return fieldsAssignedToEndpoints;
}

/** Takes fields to be stored, creates post objects and populated with user input
 * @param  {Object} validationSchema - validation schema for route requested
 * @param  {Object} body - user input
 * @param  {Boolean} person - whether application is for individual(true) or organization (false)
 * @return {Object} - A nested object of the individual objects that will be sent to SUDS by endpoint
 */
function prepareSudsPost(validationSchema, body, person){
	const fieldsToPost = [];
	db.getFieldsToStore(validationSchema, fieldsToPost, '', 'SUDS'); // mutates fieldsToPost
	const fieldsToSendByEndpoint = assignFieldsToEndpoints(fieldsToPost);
	const autoPopulateFields = populate.findAutoPopulatedFieldsFromSchema(fieldsToPost);
	const populatedPostObject = populate.populateValues(fieldsToSendByEndpoint, body, autoPopulateFields, person);
	return populatedPostObject;
}

/**
 * Set the options for the check if a contact exists
 * @param {Object} applicantInfo - portion of the body of the request with the contact information
 * @param {Boolean} person - whether the applicaion is from an individual or not
 * @param {String} token - JWT token from SUDS
 * @param {Object} apiCallLogObject - running log of the requests
 */
function setContactGETOptions(applicantInfo, person, token, apiCallLogObject){
	const endpoint = person ? 'lastName' : 'orgCode';
	const contact = person ? applicantInfo.lastName : applicantInfo.organizationName;
	const requestUri = `${auth.SUDS_API_URL}/contact/${endpoint.toLowerCase()}/${contact}`;
	const logUri = `/contact/${endpoint.toLowerCase()}/{${endpoint}}`;
	const sumReq = {};
	sumReq[endpoint] = contact;
	apiCallLogObject.GET[logUri].request = sumReq;

	const requestParams = auth.getRequestOptions(requestUri, 'GET', null, token);
	return {logUri, requestParams, apiCallLogObject: apiCallLogObject};
}

/**
 * Gets the contId to be used if a contact is created so it can be compared to the results of the contact GET request
 * @param  {Object} fieldsObj - Object containing post objects to be sent to basic api
 * @param  {Boolean} person   - Whether the application is for a person or not
 * @return {String}		   - ContId for this application
 */
function getContId(fieldsObj, person){
	return person ? fieldsObj['/contact/person'].contId : fieldsObj['/contact/organization'].contId;
}

/**
 * Calls basic API to create a contact in SUDS
 * @param  {Object} fieldsObj  - Object containing post objects to be sent to basic api
 * @param  {boolean} person	- Boolean indicating whether the contract being created is for a person or not
 * @param  {Object} apiCallLogObject - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @return {Promise}		   - Promise to be fulfilled
 */
function createContact(fieldsObj, person, apiCallLogObject, sudsToken){
	return new Promise(function(fulfill, reject){
		const endpoint = person ? '/contact/person' : '/contact/organization';
		const contactField = fieldsObj[endpoint];
		const createPersonOrOrgURL = auth.SUDS_API_URL + endpoint;
		apiCallLogObject.POST[endpoint].request = contactField;
		const createContactOptions = auth.getRequestOptions(createPersonOrOrgURL, 'POST', contactField, sudsToken);
		request.post(createContactOptions)
		.then(function(res){
			return postRequest(res, apiCallLogObject, fieldsObj, endpoint, '/contact/address', '/contact-address', sudsToken);
		})
		.then(function(res){
			return postRequest(res, apiCallLogObject, fieldsObj, '/contact-address', '/contact/phone', '/contact-phone', sudsToken);
		})
		.then(function(res){
			apiCallLogObject.POST['/contact-phone'].response = res;
			fulfill(res.contCn);
		})
		.catch((err)  => {
			errorUtil.rejectWithError(err, reject);
		});
	});
}

/**
 * Calls basic API to create an application in SUDS
 * @param  {Object} fieldsObj   - Object containing post objects to be sent to basic api
 * @param  {Number} contCN	  - Contact control number of contact associated with this application
 * @param  {Object} apiCallLogObject  - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @return {Promise}			- Promise to be fulfilled
 */
function createApplication(fieldsObj, contCN, apiCallLogObject, sudsToken){
	const createApplicationURL = `${auth.SUDS_API_URL}/application`;
	fieldsObj['/application'].contCn = contCN;
	const applicationPost = fieldsObj['/application'];
	apiCallLogObject.POST['/application'].request = applicationPost;
	const createApplicationOptions = auth.getRequestOptions(createApplicationURL, 'POST', applicationPost, sudsToken);
	return request.post(createApplicationOptions);
}

/** Handles all the information for a contact Post
 * @param  {Object} req - Request Object
 * @param  {Object} res - Response Object
 * @param  {Object} validationSchema - Schema object
 * @param  {Object} body - User input
 * @return {Promise}	 - returns Promise, but AFAICT all the promises ultimately resolve to returning a contact control number.
 */
function managePostContacts(apiCallLogObject, contactGETOptions, res, person, sudsToken, fieldsInSudsPostFormat) {
	/* Set the apiCalLLogObject
	 * get contId
	 * check for multiple
	 *	 if multiple, go through dupes and get matching contCns, and if still more than one, throw error.
	 *	 if not multiple, get contCn from matches.
	 * if no matches, return createContact
	 */
	apiCallLogObject.GET[contactGETOptions.logUri].response = res;
	if (!res.filter) {
		return createContact(fieldsInSudsPostFormat, person, apiCallLogObject, sudsToken);
	}
	const contId = getContId(fieldsInSudsPostFormat, person);
	const matches = res.filter((contact) => contact.contId === contId && contact.contCn);
	if (matches.length == 1) {
		return new Promise((resolve) => resolve(matches[0].contCn));
	}
	else if (matches.length > 1) {
		throw new DuplicateContactsError(res);
	}
	
	return createContact(fieldsInSudsPostFormat, person, apiCallLogObject, sudsToken);

}

/** Sends requests needed to create an application via the Basic API
 * @param  {Object} req - Request Object
 * @param  {Object} res - Response Object
 * @param  {Object} validationSchema - Schema object
 * @param  {Object} body - User input
 */
function post(req, res, validationSchema, body) {

	return new Promise(function (fulfill, reject){

		let apiCallLogObject = {
			'GET':{
				'/contact/lastname/{lastName}':{},
				'/contact/orgcode/{orgCode}':{}
			},
			'POST':{
				'/contact/person':{},
				'/contact/organization':{},
				'/contact-address':{},
				'/contact-phone':{},
				'/application':{}
			}
		};

		auth.getToken()
		.then(function(sudsToken) {

			const person = isAppFromPerson(body);
			const fieldsInSudsPostFormat = prepareSudsPost(validationSchema, body, person);
			const contactGETOptions = setContactGETOptions(body.applicantInfo, person, sudsToken, apiCallLogObject);
			apiCallLogObject = contactGETOptions.apiCallLogObject;

			request.get(contactGETOptions.requestParams)
			.then((res) => {
				return managePostContacts(apiCallLogObject, contactGETOptions, res, person, sudsToken, fieldsInSudsPostFormat);	
			})
			.then(function(contCn){
				return createApplication(fieldsInSudsPostFormat, contCn, apiCallLogObject, sudsToken);
			})
			.then(function(response){
				const applResponse  = response;
				apiCallLogObject.POST['/application'].response = applResponse;
				fulfill(apiCallLogObject);
			})
			.catch(function(err){
				errorUtil.SUDSServiceError(req, res, err);
			});
		})
		.catch(reject);
	});

}

module.exports.post = post;
module.exports.prepareSudsPost = prepareSudsPost;
module.exports.setContactGETOptions = setContactGETOptions;
module.exports.managePostContacts = managePostContacts;

