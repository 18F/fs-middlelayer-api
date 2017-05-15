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
// AUTO-POPULATE FUNCTIONS
/**
 * Concats all indexs of input
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}      - Single string made up of all indicies of input 
 */
function concat(input){
	const output = input.join('');
	return output;
}

/**
 * Ensures all characters of input are upper case then joins them
 * @param  {Array} input - Array of strings to be joined together
 * @return {String}      - Single string made up of all indicies of input 
 */
function contId(input){
	return concat(
		input.map((i)=>{
			return i.toUpperCase();
		})
	);
}

//*******************************************************************

/**
 * Returns wheather application is for an individual.
 * @param  {Object}  body - User input
 * @return {Boolean}      - Whether application is for an individual
 */
function isAppFromPerson(body){
	const output = (!body.applicantInfo.orgType || body.applicantInfo.orgType === 'Individual');
	return output;
}

/** Finds basic API fields which are to be auto-populated
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

/**
 * Given a path seperated by periods, return the field specified if it exists, else false.
 * @param  {String} path                  - String made of the path to the desired field, must be seperated by periods
 * @param  {Object} body                  - Object representing the user input
 * @return {Boolean|String|Number|Object} - Contents of the field specified or false
 */
function getFieldFromBody(path, body){
	const pathParts = path.split('.');
	pathParts.forEach((pathPart)=>{
		body = body[pathPart];
	});
	if (body){
		return body;
	}
	else {
		return false;
	}
}
/** Given list of fields which must be auto-populate, returns values to store
 * @param  {Array} fieldsToBuild - Array of objects representing Fields which need to be auto-populated
 * @param  {Object} body   - user input
 * @return {Array}         - created values
 */
function buildAutoPopulatedFields(fieldsToBuild, body){
	const output = {};
	fieldsToBuild.forEach((field)=>{
		const key = Object.keys(field)[0];
		const fieldMakeUp = [];
		let autoPopulatedFieldValue = '';
		field[key].madeOf.fields.forEach((madeOfField)=>{
			if (madeOfField.fromBody){
				const fieldValue = getFieldFromBody(madeOfField.field, body);
				if (fieldValue){
					fieldMakeUp.push(fieldValue);
				}
				else {
					console.error(`${madeOfField.field} does not exist`);
				}
			}
			else {
				fieldMakeUp.push(madeOfField.value);
			}
		});
		switch (field[key].madeOf.function){
		case 'concat':
			autoPopulatedFieldValue = concat(fieldMakeUp);
			break;
		case 'contId':
			if (isAppFromPerson(body)){
				if (fieldMakeUp.length > 3){
					fieldMakeUp.pop();
				}
				autoPopulatedFieldValue = contId(fieldMakeUp);
			}
			else {
				const toUse = [];
				toUse.push(fieldMakeUp.pop());
				autoPopulatedFieldValue = contId(toUse);
			}
			break;
		}
		output[key] = autoPopulatedFieldValue;
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
	const addressURL = `${SUDS_API_URL}${requestPath}`;
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
 * Calls basic API to create a contact in SUDS
 * @param  {Object} fieldsObj  - Object containing post objects to be sent to basic api
 * @param  {boolean} person    - Boolean indicating whether the contract being created is for a person or not
 * @param  {Object} postObject - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @return {Promise}		   - Promise to be fulfilled
 */
function createContact(fieldsObj, person, postObject){
	return new Promise(function(fulfill, reject){
		let contactField, createPersonOrOrgURL, responseKey;
		if (person){
			contactField = fieldsObj['/contact/person'];
			createPersonOrOrgURL = `${SUDS_API_URL}/contact/person`;
			responseKey = '/contact/person';
			postObject[responseKey].request = contactField;
		}
		else {
			contactField = fieldsObj['/contact/organization'];
			createPersonOrOrgURL = `${SUDS_API_URL}/contact/orgcode`;
			responseKey = '/contact/orgcode';
			postObject[responseKey].request = contactField;
		}
		const createContactOptions = {
			method: 'POST',
			uri: createPersonOrOrgURL,
			body: contactField,
			json: true
		};
		request(createContactOptions)
		.then(function(res){
			return postRequest(res, postObject, fieldsObj, responseKey, '/contact/address', '/contact-address');
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

/**
 * Calls basic API to create an application in SUDS
 * @param  {Object} fieldsObj   - Object containing post objects to be sent to basic api
 * @param  {Number} contCN      - Contact control number of contact associated with this application
 * @param  {Object} postObject  - Object used to save the request and response for each post to the basic api. Used for testing purposes.
 * @return {Promise}            - Promise to be fulfilled
 */
function createApplication(fieldsObj, contCN, postObject){
	const createApplicationURL = `${SUDS_API_URL}/application`;
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
}

/** Sends requests needed to create an application via the Basic API
 * @param  {Object} req - Request Object
 * @param  {Object} res - Response Object
 * @param  {Object} sch - Schema object 
 * @param  {Object} body - User input
 */
function postToBasic(req, res, sch, body){ //Should remove control number once we get from BASIC api

	return new Promise(function (fulfill, reject){

		const postObject = {
			'/contact/person':{},
			'/contact/orgcode':{},
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

		const person = isAppFromPerson(body);
		let existingContactCheck;
		if (person){
			const lastName = body.applicantInfo.lastName;
			existingContactCheck = `${SUDS_API_URL}/contact/lastname/${lastName}`;
		}
		else {
			let orgName = body.applicantInfo.organizationName;
			if (!orgName){
				orgName = 'abc';
			}
			existingContactCheck = `${SUDS_API_URL}/contact/orgcode/${orgName}`;
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
				Promise.resolve(res.contCn);
			}
			else {
				return createContact(fieldsObj, person, postObject);
			}
		})
		.then(function(contCN){
			return createApplication(fieldsObj, contCN, postObject);
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
