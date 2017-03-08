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

//*******************************************************************
// exports

module.exports.build_error_message = build_error_message;
module.exports.invalid_field = invalid_field;
module.exports.field_type = field_type;
module.exports.copyGenericInfo = copyGenericInfo;
