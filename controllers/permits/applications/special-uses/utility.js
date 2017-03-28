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
const path = require('path');
const AWS = require('aws-sdk');
const errors = require('./patternErrorMessages.json');

//*************************************************************
// AWS

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

AWS.config.update({
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

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

function createPost(formType, controlNumber, inputPost){
	
	const postSchema = include('controllers/permits/applications/special-uses/postSchema.json');

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

	return postData;
}

function putUpload(uploadReq, uploadField, controlNumber){

	//console.log('uploadReq : ' + JSON.stringify(uploadReq) );
	//console.log('uploadField : ' + uploadField );

	const uploadFile = {};

	if (!uploadReq) {
		console.log('uploadFile invalid error');
	}
	else if (uploadReq.length <= 0) {
		console.log('uploadFile missing error');
	}
	else {
		uploadFile.file = uploadReq[0];
	}

	if (uploadFile.file === undefined) {		
		console.log('uploadFile undefined error');
	}
	else {
		uploadFile.originalname = uploadFile.file.originalname;
		uploadFile.filename = path.parse(uploadFile.file.originalname).name;
		uploadFile.ext = path.parse(uploadFile.file.originalname).ext;
		uploadFile.size = uploadFile.file.size;
		uploadFile.mimetype = uploadFile.file.mimetype;
		uploadFile.encoding = uploadFile.file.encoding;
		uploadFile.buffer = uploadFile.file.buffer;
		uploadFile.keyname = controlNumber +'/' + uploadField + '/' + uploadFile.filename +'-'+Date.now() + uploadFile.ext;
		
		//console.log('uploadFile.originalname : ' + uploadFile.originalname);
		//console.log('uploadFile.filename : ' + uploadFile.filename);
		//console.log('uploadFile.ext : ' + uploadFile.ext);
		//console.log('uploadFile.size : ' + uploadFile.size);
		//console.log('uploadFile.mimetype : ' + uploadFile.mimetype);
		console.log('uploadFile.keyname : ' + uploadFile.keyname);
		
		const params = {
			Bucket: AWS_BUCKET_NAME, 
			Key: uploadFile.keyname,
			Body: uploadFile.buffer,
			ACL: 'private' 
		};

		s3.putObject(params, function(err, data) {
			if (err) {
				console.error(err, err.stack); 
			}
			else {     
				console.log(data);   
			}      
		});			
	}

}

//*******************************************************************
// exports

module.exports.buildErrorMessage = buildErrorMessage;
module.exports.copyGenericInfo = copyGenericInfo;
module.exports.createPost = createPost;
module.exports.putUpload = putUpload;
