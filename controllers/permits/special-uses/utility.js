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

	jsonData['applicant-info'] = applicantInfo;
}

function createPost(formType, inputPost){
	
	const postSchema = include('controllers/permits/special-uses/post_schema.json');

	const postData = {};
	let combId = '';
	let key;
	let purpose;

	const genericFields = postSchema['generic-fields'];
	
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

	postData['applicant-info'] = postSchema['applicant-info'];

	if (inputPost.hasOwnProperty('applicant-info')){
		for (key in inputPost['applicant-info']) {
			//console.log('applicant-info key: '+ key + " -> " + inputPost['applicant-info'][key]);
			if (inputPost['applicant-info'].hasOwnProperty(key)) {
				postData['applicant-info'][key] = inputPost['applicant-info'][key];	
			}
		}	

		if (inputPost['applicant-info'].organizationName){
			postData['applicant-info'].contactType = 'ORGANIZATION'; 
		}
		else {
			postData['applicant-info'].contactType = 'PERSON'; 
		}
		
		if (postData['applicant-info'].contactType === 'ORGANIZATION'){
			postData['applicant-info'].contName = inputPost['applicant-info'].organizationName;
		}
		else {
			postData['applicant-info'].contName = inputPost['applicant-info'].firstName + ' ' + inputPost['applicant-info'].lastName;
		}

	}

	if (formType === 'noncommercial'){

		postData.type = 'noncommercial'; 

		postData['noncommercial-fields'] = postSchema['noncommercial-fields'];

		if (inputPost.hasOwnProperty('noncommercial-fields')){
			for (key in inputPost['noncommercial-fields']) {
				//console.log('noncommercial-fields key: '+ key + " -> " + inputPost['noncommercial-fields'][key]);
				if (inputPost['noncommercial-fields'].hasOwnProperty(key)){
					postData['noncommercial-fields'][key] = inputPost['noncommercial-fields'][key];		
				}
			}	
		}

		purpose = generatePurpose (postData['noncommercial-fields'].activityDescription,
										postData['noncommercial-fields'].locationDescription,
										postData['noncommercial-fields'].startDateTime,
										postData['noncommercial-fields'].endDateTime);

		postData['noncommercial-fields'].purpose = purpose;

	}
	else if (formType === 'outfitters'){

		postData.type = 'temp-outfitter-guide';

		postData['temp-outfitter-fields'] = postSchema['temp-outfitter-fields'];

		if (inputPost.hasOwnProperty('temp-outfitter-fields')){
			for (key in inputPost['temp-outfitter-fields']) {
				//console.log('temp-outfitter-fields key: '+ key + " -> " + inputPost['temp-outfitter-fields'][key]);
				if (inputPost['temp-outfitter-fields'].hasOwnProperty(key)){
					postData['temp-outfitter-fields'][key] = inputPost['temp-outfitter-fields'][key];
				}	
			}	
		}

		purpose = generatePurpose (postData['temp-outfitter-fields'].activityDescription,
										postData['temp-outfitter-fields'].locationDescription,
										postData['temp-outfitter-fields'].startDateTime,
										postData['temp-outfitter-fields'].endDateTime);

		postData['temp-outfitter-fields'].purpose = purpose;
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
