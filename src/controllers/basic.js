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

const db = require('./db.js');
const SUDS_API_URL = process.env.SUDS_API_URL;

//*******************************************************************

/** Finds basic API fields are to be auto-populated
 * @param  {Array} basicFields - Fields(Objects) which are stored in SUDS
 * @return {Array} - Fields(Objects) which are to be auto-populated
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
 * @param  {Array} - Array of objects representing Fields which need to be auto-populated
 * @param  {Object} body - user input
 * @return {Array} - created values
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
 * Gets the data from all fields that are to be send to the basic API, also builds post object, used to pass data to basic api
 * @param  {Array} fields - All fields in object form which will be sent to basicAPI
 * @param  {Object} body - user input
 * @param  {Object} autoPopValues - All values which have been auto-populated
 * @return {Array} - Array of post objects
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
 * @return {Array} - All post objects 
 */
function prepareBasicPost(sch, body){
	const otherFields = [];
	db.getFieldsToStore(sch, otherFields, '', 'basic');
	const toBuild = getAutoPopulatedFields(otherFields);
	const autoPopulateValues = buildAutoPopulatedFields(toBuild, body);
	const fieldsToPost = getBasicFields(otherFields, body, autoPopulateValues);
	return fieldsToPost;
}

/**
 * Creates request for Basic API calls to create contact
 * @param  {Object} res         - Response of previous request
 * @param  {Object} postObject  - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @param  {Object} fieldsObj   - Object containing post objects to be sent to basic api
 * @param  {String} responseKey - Key in postObject for the response object of the previous request
 * @param  {String} requestKey  - Key in postObject for the request object of this request
 * @param  {String} requestPath - Path from basic API route this response needs to be sent to
 * @return {Promise}            - Promise to be fulfilled
 */
function postRequest(res, postObject, fieldsObj, responseKey, requestKey, requestPath){
	postObject[responseKey].response = res;
	const cn = res.contCn;
	const addressField = fieldsObj[requestKey];
	addressField.contact = cn;
	const addressURL = `${SUDS_API_URL}${requestPath}/`;
	postObject[requestPath].request = addressField;
	const createAddressOptions = {
		method: 'POST',
		uri: addressURL,
		body: addressField,
		json: true
	};
	return request(createAddressOptions);
}
/**
 * [createContact description]
 * @param  {Object} fieldsObj  Object containing post objects to be sent to basic api
 * @param  {boolean} person    Boolean indicating whether the contract being created is for a person or not
 * @param  {Object} postObject Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @return {Promise}
 */
function createContact(fieldsObj, person, postObject){
	return new Promise(function(fulfill, reject){
		let contactField, createPersonOrOrgURL;
		if (person){
			contactField = fieldsObj['/contact/person'];
			createPersonOrOrgURL = `${SUDS_API_URL}/contact/person/`;
		}
		else {
			contactField = fieldsObj['/contact/organization'];
			createPersonOrOrgURL = `${SUDS_API_URL}/contact/orgcode/`;
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
			return postRequest(res, postObject, fieldsObj, '/contact/personOrOrgcode', '/contact/address', '/contact-address');
		})
		.then(function(res){
			return postRequest(res, postObject, fieldsObj, '/contact-address', '/contact/phone', '/contact-phone');
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
function postToBasic(req, res, sch, body){ //Should remove control number once we get from BASIC api

	return new Promise(function(fulfill, reject){

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
			existingContactCheck = `${SUDS_API_URL}/contact/orgcode/${orgName}/`;
		}
		else {
			const lastName = body.applicantInfo.lastName;
			existingContactCheck = `${SUDS_API_URL}/contact/person/${lastName}/`;
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
			const createApplicationURL = `${SUDS_API_URL}/application/`;
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
			fulfill(postObject);
		})
		.catch(function(err){
			reject(err);
		});

	});

}

module.exports.postToBasic = postToBasic;
