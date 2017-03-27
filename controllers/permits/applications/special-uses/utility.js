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

const jsf = require('json-schema-faker');
const include = require('include')(__dirname);
const errors = require('./patternErrorMessages.json');

//*******************************************************************

function makeFieldReadable(input){

	return input
	.replace(/([A-Z])/g, ' $1')
	.replace(/^./, function(str){
		return str.toUpperCase();
	})
	.replace('Z I P', 'Zip');

}

function makePathReadable(input){

	if (typeof input === 'string'){
		const parts = input.split('.');
		const readableParts = [];
		let readablePath = '';
		parts.forEach((field)=>{
			readableParts.push(makeFieldReadable(field));
		});
		readablePath = readableParts.shift();
		readableParts.forEach((part)=>{
			readablePath = `${readablePath}/${part}`;
		});
		return readablePath;
	}
	else {
		return false;
	}

}

function buildFormatErrorMessage(fullPath){
	const field = fullPath.substring(fullPath.lastIndexOf('.') + 1);
	const readablePath = makePathReadable(fullPath);
	const errorMessage = `${readablePath}${errors[field]}`;
	return errorMessage;

}

function buildErrorMessage(output){

	let errorMessage = '';
	const messages = [];
	output.errorArray.forEach((error)=>{

		const missing = `${makePathReadable(error.field)} is a required field.`;
		const type = `${makePathReadable(error.field)} is expected to be type '${error.expectedFieldType}'.`;
		const enumMessage = `${makePathReadable(error.field)} ${error.enumMessage}.`;
		const dependencies = `Having ${makePathReadable(error.field)} requires that ${makePathReadable(error.dependency)} be provided.`;

		switch (error.errorType){
		case 'missing':
			messages.push(missing);
			break;
		case 'type':
			messages.push(type);
			break;
		case 'format':
		case 'pattern':
			messages.push(buildFormatErrorMessage(error.field));
			break;
		case 'enum':
			messages.push(enumMessage);
			break;
		case 'dependencies':
			messages.push(dependencies);
			break;
		}

	});
	messages.forEach((message)=>{
		errorMessage = `${errorMessage}${message} `;
	});
	errorMessage = errorMessage.trim();
	return errorMessage;

}

const pad = function (n) {
	return  ('0' + n).slice(-2);
};

const generatePurpose = function (activityDescription, locationDescription, startDateTime, endDateTime){

	let purpose = '';

	if (activityDescription){
		purpose = purpose + activityDescription + ' ' ;
	}
	if (locationDescription){
		purpose = purpose + locationDescription + ' ';
	}
	if (startDateTime){
		purpose = purpose + startDateTime + ' ';
	}
	if (endDateTime){
		purpose = purpose + endDateTime + ' ';
	}

	purpose = purpose.trim();

	return purpose;

};

function copyGenericInfo(cnData, jsonData){

	const adminOrg = cnData.adminOrg;
	jsonData.controlNumber = cnData.accinstCn;
	jsonData.region = adminOrg.slice(0, 2);
	jsonData.forest = adminOrg.slice(2, 4);
	jsonData.district = adminOrg.slice(4, 6);
	jsonData.authorizingOfficerName = cnData.authOfficerName;
	jsonData.authorizingOfficerTitle = cnData.authOfficerTitle;

	const addressData = cnData.addresses[0];
	const phoneData = cnData.phones[0];
	const holderData = cnData.holders[0];

	const applicantInfo = {};
	const phoneNumber = {};
    
	applicantInfo.contactControlNumber = addressData.contCn;
	applicantInfo.firstName = holderData.firstName;
	applicantInfo.lastName = holderData.lastName;
    
	phoneNumber.areaCode = phoneData.areaCode;
	phoneNumber.number = phoneData.phoneNumber;
	phoneNumber.extension = phoneData.extension;
	phoneNumber.type = phoneData.phoneNumberType;

	applicantInfo.dayPhone = phoneNumber;
	applicantInfo.eveningPhone = phoneNumber;
	applicantInfo.emailAddress = addressData.email;
	applicantInfo.mailingAddress = addressData.address1;
	applicantInfo.mailingAddress2 = addressData.address2;
	applicantInfo.mailingCity = addressData.cityName;
	applicantInfo.mailingState = addressData.stateCode;
	applicantInfo.mailingZIP = addressData.postalCode;

	if (addressData.contactType === 'ORGANIZATION'){
		applicantInfo.organizationName = addressData.contName;
	}
	else {
		applicantInfo.organizationName = null;  
	}
	applicantInfo.website = null;
	applicantInfo.orgType = holderData.orgType;

	jsonData.applicantInfo = applicantInfo;
}

function autoPopulatedFields(postData, inputPost){

	let combId = '', purpose;

	combId = pad(inputPost.region);
	combId = combId + pad(inputPost.forest);
	combId = combId + pad(inputPost.district);

	postData.securityId = combId;
	postData.managingOrg = combId;
	postData.adminOrg = combId;

	const todayDate = new Date().toISOString().slice(0, 10);
	postData.effectiveDate = todayDate;

	if (inputPost.applicantInfo.organizationName){
		postData.applicantInfo.contactType = 'ORGANIZATION'; 
	}
	else {
		postData.applicantInfo.contactType = 'PERSON'; 
	}
	
	if (postData.applicantInfo.contactType === 'ORGANIZATION'){
		postData.applicantInfo.contName = inputPost.applicantInfo.organizationName;
	}
	else {
		postData.applicantInfo.contName = inputPost.applicantInfo.firstName + ' ' + inputPost.applicantInfo.lastName;
	}

	if (inputPost.type === 'noncommercial'){

		postData.type = 'noncommercial';

		purpose = generatePurpose (postData.noncommercialFields.activityDescription,
										postData.noncommercialFields.locationDescription,
										postData.noncommercialFields.startDateTime,
										postData.noncommercialFields.endDateTime);

		postData.noncommercialFields.purpose = purpose;
		delete postData.tempOutfitterFields;

	}
	else if (inputPost.type === 'tempOutfitters'){

		postData.type = 'tempOutfitters';

		purpose = generatePurpose (postData.tempOutfitterFields.activityDescription,
										postData.tempOutfitterFields.locationDescription,
										postData.tempOutfitterFields.startDateTime,
										postData.tempOutfitterFields.endDateTime);

		postData.tempOutfitterFields.purpose = purpose;
		delete postData.noncommercialFields;
	}

	delete postData.id;

}

function populatePostData(inputPost, postData, schemaData){

	let fieldKey = '';
	for (fieldKey in schemaData){
		if (inputPost.hasOwnProperty(fieldKey)){
			if (typeof inputPost[fieldKey] !== 'object'){
				postData[fieldKey] = inputPost[fieldKey];
			}
			else {
				populatePostData(inputPost[fieldKey], postData[fieldKey], schemaData[fieldKey]);
			}
		}
	}

}

function createPost(formType, controlNumber, inputPost){
	
	const postSchema = include('controllers/permits/applications/special-uses/postSchema.json'); 
	jsf.option({useDefaultValue:true});
	const schemaData = jsf(postSchema);
	
	const postData = schemaData;

	populatePostData(inputPost, postData, schemaData);
	autoPopulatedFields(postData, inputPost);

	return postData;
	
}

//*******************************************************************
// exports

module.exports.buildErrorMessage = buildErrorMessage;
module.exports.copyGenericInfo = copyGenericInfo;
module.exports.createPost = createPost;
