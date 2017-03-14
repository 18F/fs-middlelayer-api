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

const _ = require('lodash');
const include = require('include')(__dirname);

//*******************************************************************

function buildMissingErrorMessage(errorArray){

	let errorMessage = _.join(errorArray, ' and ');

	if (errorArray.length > 1){

		errorMessage += ' are required fields!';

	}
	else {

		errorMessage += ' is a required field!';

	}

	return errorMessage;

}

function buildTypeErrorMessage(typeObj){

	const errorMessage = typeObj.field + ' is expected to be type \'' + typeObj.expectedType + '\'.';
	return errorMessage;

}

function buildErrorMessage(output){

	let missingMessage = '', typeMessage = '', errorMessage = '';

	if (!_.isEmpty(output.missingArray)){

		missingMessage = buildMissingErrorMessage(output.missingArray);
		errorMessage = errorMessage + missingMessage;

	}
	if (!_.isEmpty(output.typeArray)){

		output.typeArray.forEach((element)=>{

			typeMessage = typeMessage + buildTypeErrorMessage(element) + ' ';

		});
		errorMessage = errorMessage + typeMessage;

	}
    
	return errorMessage;

}

const invalidField = function (output, field){
    
	output.fieldsValid = false;
	output.missingArray.push(field);

	return output;

};

const fieldType = function (output, field, expectedType){
    
	output.fieldsValid = false;
	output.typeArray.push({

		'field':field,
		'expectedType':expectedType

	});

	return output;

};

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

function createPost(formType, controlNumber, inputPost){
	
	const postSchema = include('controllers/permits/special-uses/postSchema.json');

	const postData = {};
	let combId = '';
	let key;
	let purpose;

	const genericFields = postSchema.genericFields;

	if (controlNumber){
		postData.controlNumber = controlNumber;
	}
	
	if (genericFields){
		for (key in genericFields) {
			if (genericFields.hasOwnProperty(key)) {
				postData[key] = genericFields[key];	
			}
		}
	}

	postData.region = inputPost.region;
	postData.forest = inputPost.forest;
	postData.district = inputPost.district;
	if (inputPost.authorizingOfficerName){
		postData.authorizingOfficerName = inputPost.authorizingOfficerName;
	}
	if (inputPost.authorizingOfficerTitle){
		postData.authorizingOfficerTitle = inputPost.authorizingOfficerTitle;
	}

	combId = pad(inputPost.region);
	combId = combId + pad(inputPost.forest);
	combId = combId + pad(inputPost.district);

	postData.securityId = combId;
	postData.managingOrg = combId;
	postData.adminOrg = combId;

	const todayDate = new Date().toISOString().slice(0, 10);
	postData.effectiveDate = todayDate;

	//console.log('pre postData='+JSON.stringify(postData));

	postData.applicantInfo = postSchema.applicantInfo;

	if (inputPost.hasOwnProperty('applicantInfo')){
		for (key in inputPost.applicantInfo) {
			if (inputPost.applicantInfo.hasOwnProperty(key)) {
				postData.applicantInfo[key] = inputPost.applicantInfo[key];	
			}
		}	

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

	}

	if (formType === 'noncommercial'){

		postData.type = 'noncommercial'; 

		postData.noncommercialFields = postSchema.noncommercialFields;

		if (inputPost.hasOwnProperty('noncommercialFields')){
			for (key in inputPost.noncommercialFields) {
				if (inputPost.noncommercialFields.hasOwnProperty(key)){
					postData.noncommercialFields[key] = inputPost.noncommercialFields[key];		
				}
			}	
		}

		purpose = generatePurpose (postData.noncommercialFields.activityDescription,
										postData.noncommercialFields.locationDescription,
										postData.noncommercialFields.startDateTime,
										postData.noncommercialFields.endDateTime);

		postData.noncommercialFields.purpose = purpose;

	}
	else if (formType === 'outfitters'){

		postData.type = 'tempOutfitterGuide';

		postData.tempOutfitterFields = postSchema.tempOutfitterFields;

		if (inputPost.hasOwnProperty('tempOutfitterFields')){
			for (key in inputPost.tempOutfitterFields) {
				if (inputPost.tempOutfitterFields.hasOwnProperty(key)){
					postData.tempOutfitterFields[key] = inputPost.tempOutfitterFields[key];
				}	
			}	
		}

		purpose = generatePurpose (postData.tempOutfitterFields.activityDescription,
										postData.tempOutfitterFields.locationDescription,
										postData.tempOutfitterFields.startDateTime,
										postData.tempOutfitterFields.endDateTime);

		postData.tempOutfitterFields.purpose = purpose;
	}

	//console.log('postData='+JSON.stringify(postData));

	return postData;
}

//*******************************************************************
// exports

module.exports.buildErrorMessage = buildErrorMessage;
module.exports.invalidField = invalidField;
module.exports.fieldType = fieldType;
module.exports.copyGenericInfo = copyGenericInfo;
module.exports.createPost = createPost;
