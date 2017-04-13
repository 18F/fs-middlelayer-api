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
const error = require('./error.js');
const basicURL = process.env.BASICURL;

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
function postToBasic(req, res, sch, body, controlNumber){ //Should remove control number once we get from BASIC api

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
		jsonResponse.controlNumber = controlNumber;
		jsonResponse.basicPosts = postObject;
		return res.json(jsonResponse);
	})
	.catch(function(err){
		return error.sendError(req, res, 500, err);
	});
}

module.exports.postToBasic = postToBasic;
