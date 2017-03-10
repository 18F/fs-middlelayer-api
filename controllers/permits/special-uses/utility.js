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

var _ = require('lodash');
var include = require('include')(__dirname);

//*******************************************************************

function build_missing_error_message(error_array){

	var error_message = _.join(error_array, ' and ');

	if (error_array.length > 1){

		error_message += ' are required fields!';

	}
	else {

		error_message += ' is a required field!';

	}

	return error_message;

}

function build_type_error_message(type_obj){

	var error_message = type_obj.field + ' is expected to be type \'' + type_obj.expected_type + '\'.';
	return error_message;

}

function build_error_message(output){

	var missing_message = '', type_message = '', error_message = '';

	if (!_.isEmpty(output.missing_array)){

		missing_message = build_missing_error_message(output.missing_array);
		error_message = error_message + missing_message;

	}
	if (!_.isEmpty(output.type_array)){

		output.type_array.forEach((element)=>{

			type_message = type_message + build_type_error_message(element) + ' ';

		});
		error_message = error_message + type_message;

	}
    
	return error_message;

}

var invalid_field = function (output, field){
    
	output.fields_valid = false;
	output.missing_array.push(field);

	return output;

};

var field_type = function (output, field, expected_type){
    
	output.fields_valid = false;
	output.type_array.push({

		'field':field,
		'expected_type':expected_type

	});

	return output;

};

function copyGenericInfo(cnData, jsonData){

	var adminOrg = cnData.adminOrg;
	jsonData.controlNumber = cnData.accinstCn;
	jsonData.region = adminOrg.slice(0, 2);
	jsonData.forest = adminOrg.slice(2, 4);
	jsonData.district = adminOrg.slice(4, 6);
	jsonData.authorizingOfficerName = cnData.authOfficerName;
	jsonData.authorizingOfficerTitle = cnData.authOfficerTitle;

	var addressData = cnData.addresses[0];
	var phoneData = cnData.phones[0];
	var holderData = cnData.holders[0];

	var applicantInfo = {};
	var phoneNumber = {};
    
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

function create_post(formType, inputPost){
	
	var postSchema = include('controllers/permits/special-uses/post_schema.json');

	var postData = {};
	delete postData['applicant-info'];
	delete postData['noncommercial-fields'];
	delete postData['temp-outfitter-fields'];
	
	postData = postSchema['generic-fields'];
	postData['applicant-info'] = postSchema['applicant-info'];
	
	postData.region = inputPost.region;
	postData.forest = inputPost.forest;
	postData.district = inputPost.district;
	if(inputPost.authorizingOfficerName){
		postData.authorizingOfficerName = inputPost.authorizingOfficerName;
	}
	if(inputPost.authorizingOfficerTitle){
		postData.authorizingOfficerTitle = inputPost.authorizingOfficerTitle;
	}

	var combId = '';

	combId = pad(inputPost.region);
	combId = combId + pad(inputPost.forest);
	combId = combId + pad(inputPost.district);

	postData.securityId = combId;
	postData.managingOrg = combId;
	postData.adminOrg = combId;

	var todayDate = new Date().toISOString().slice(0,10);
	postData.effectiveDate = todayDate;

	console.log('pre postData='+JSON.stringify(postData));

	if(inputPost.hasOwnProperty('applicant-info')){
		for (var key in inputPost['applicant-info']) {
			console.log('applicant-info key: '+ key + " -> " + inputPost['applicant-info'][key]);
			postData['applicant-info'][key] = inputPost['applicant-info'][key];	
		}	

		if(inputPost['applicant-info'].organizationName){
			postData['applicant-info'].contactType = 'ORGANIZATION'; 
		}
		else {
			postData['applicant-info'].contactType = 'PERSON'; 
		}
		
		if(postData['applicant-info'].contactType === 'ORGANIZATION'){
			postData['applicant-info'].contName = inputPost['applicant-info'].organizationName;
		}
		else{
			postData['applicant-info'].contName = inputPost['applicant-info'].firstName + ' ' + inputPost['applicant-info'].lastName;
		}

	}

	if(formType === 'noncommercial'){

		postData.type = 'noncommercial'; 

		postData['noncommercial-fields'] = postSchema['noncommercial-fields'];

		if(inputPost.hasOwnProperty('noncommercial-fields')){
			for (var key in inputPost['noncommercial-fields']) {
				console.log('noncommercial-fields key: '+ key + " -> " + inputPost['noncommercial-fields'][key]);
				postData['noncommercial-fields'][key] = inputPost['noncommercial-fields'][key];	
			}	
		}

		var purpose = '';

		if(postData['noncommercial-fields'].activityDescription){
			purpose = purpose + postData['noncommercial-fields'].activityDescription + ' ' ;
		}
		if(postData['noncommercial-fields'].locationDescription){
			purpose = purpose + postData['noncommercial-fields'].locationDescription + ' ';
		}
		if(postData['noncommercial-fields'].startDateTime){
			purpose = purpose + postData['noncommercial-fields'].startDateTime + ' ';
		}
		if(postData['noncommercial-fields'].endDateTime){
			purpose = purpose + postData['noncommercial-fields'].endDateTime + ' ';
		}

		purpose = purpose.trim();

		postData['noncommercial-fields'].purpose = purpose;

	}
	else if (formType === 'outfitters'){

		postData.type = 'temp-outfitter-guide';

		postData['temp-outfitter-fields'] = postSchema['temp-outfitter-fields'];

		if(inputPost.hasOwnProperty('temp-outfitter-fields')){
			for (var key in inputPost['temp-outfitter-fields']) {
				console.log('temp-outfitter-fields key: '+ key + " -> " + inputPost['temp-outfitter-fields'][key]);
				postData['temp-outfitter-fields'][key] = inputPost['temp-outfitter-fields'][key];	
			}	
		}

		var purpose = '';

		if(postData['temp-outfitter-fields'].activityDescription){
			purpose = purpose + postData['temp-outfitter-fields'].activityDescription + ' ' ;
		}
		if(postData['temp-outfitter-fields'].locationDescription){
			purpose = purpose + postData['temp-outfitter-fields'].locationDescription + ' ';
		}
		if(postData['temp-outfitter-fields'].startDateTime){
			purpose = purpose + postData['temp-outfitter-fields'].startDateTime + ' ';
		}
		if(postData['temp-outfitter-fields'].endDateTime){
			purpose = purpose + postData['temp-outfitter-fields'].endDateTime + ' ';
		}

		purpose = purpose.trim();

		postData['temp-outfitter-fields'].purpose = purpose;
	}

	console.log('postData='+JSON.stringify(postData));

	return postData;
}

function pad(n) {
	return  ('0' + n).slice(-2);
}

//*******************************************************************
// exports

module.exports.build_error_message = build_error_message;
module.exports.invalid_field = invalid_field;
module.exports.field_type = field_type;
module.exports.copyGenericInfo = copyGenericInfo;
module.exports.create_post = create_post;
