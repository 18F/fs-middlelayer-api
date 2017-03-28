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
const path = require('path');
const AWS = require('aws-sdk');
const errors = require('./patternErrorMessages.json');

//*************************************************************
// AWS

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

AWS.config.update({
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	region: AWS_REGION
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

function fromAdminOrg(cnData, postSchema, jsonData, key){

	const adminOrg = cnData[postSchema.adminOrg.intake];
	switch (key){
	case 'region':
		jsonData[key] = adminOrg.slice(0, 2);
		break;
	case 'forest':
		jsonData[key] = adminOrg.slice(2, 4);
		break;
	case 'district':
		jsonData[key] = adminOrg.slice(4, 6);
		break;
	}

}

function getTopLevelField(intakeField, cnData, postSchema, jsonData, key){

	switch (intakeField){
	case 'middleLayer':
		//jsonData[key] = getFromMiddleLayer(key)
		break;
	case 'none':
		break;
	case 'fromAdminOrg':
		fromAdminOrg(cnData, postSchema, jsonData, key);
		break;
	default:
		if (cnData.hasOwnProperty(postSchema[key].intake)){
	
			jsonData[key] = cnData[postSchema[key].intake];
		
		}
	}

}

function getSubLevelField(cnData, postSchema, key, jsonData){

	const addressData = cnData.addresses[0];
	const phoneData = cnData.phones[0];
	const holderData = cnData.holders[0];
	const path = postSchema[key].intake.split('/');
	let data;
	switch (path[0]){
	case 'holders':
		data = holderData;
		break;
	case 'phones':
		data = phoneData;
		break;
	case 'addresses':
		data = addressData;
		break;
	}
	if (data.hasOwnProperty(path[1])){
		jsonData[key] = data[path[1]];
	}

}

function buildGetResponse(cnData, schemaData, jsonData, postSchema){

	let key; 
	for (key in schemaData){
		
		if (typeof jsonData[key] !== 'object'){
			
			const intakeField = postSchema[key].intake;
			if (intakeField.indexOf('/') === -1){
				
				getTopLevelField(intakeField, cnData, postSchema, jsonData, key);
			
			}
			else {
				
				getSubLevelField(cnData, postSchema, key, jsonData);
			}
		}
		else {
			buildGetResponse(cnData, schemaData[key], jsonData[key], postSchema[key]);
		}
	}

}
function copyGenericInfo(cnData, jsonData){

	const postSchema = include('controllers/permits/applications/special-uses/getSchema.json');
	jsf.option({useDefaultValue:true});
	const schemaData = jsf(postSchema);
	delete schemaData.id;

	jsonData = schemaData;
	buildGetResponse(cnData, schemaData, jsonData, postSchema);

	/*
		Lock down all fields expected to be returned
	*/

	return jsonData;
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

	if (inputPost.body) {
		inputPost = JSON.parse(inputPost.body);
	}
	
	populatePostData(inputPost, postData, schemaData);
	autoPopulatedFields(postData, inputPost);

	return postData;
	
}

function putUpload(uploadReq, uploadField, controlNumber){

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
