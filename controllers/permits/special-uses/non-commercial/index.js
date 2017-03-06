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

var include = require('include')(__dirname);
var _ = require('lodash');
var noncommercial_data = require('../../../../test/data/basicGET.json');

//*******************************************************************
// validation

var validate_special_use = include('controllers/permits/special-uses/validate.js');
var validate_noncommercial = include('controllers/permits/special-uses/non-commercial/validate.js');
var error = include('error.js');
var util = include('controllers/permits/special-uses/utility.js');

//*******************************************************************
// controller

var get = {};
var put = {};
var post;

// get all

get.all = function(req,res){

    return include('test/data/non-commercial.get.all.json');

};

// get id

get.id = function(req,res){
	
	var jsonData = {};

	var jsonResponse = {};
	jsonResponse['success'] = false;
	jsonResponse['api'] = 'FS ePermit API';
	jsonResponse['type'] = 'controller';
	jsonResponse['verb'] = 'get';
	jsonResponse['src'] = 'json';
	jsonResponse['route'] = 'permits/special-uses/commercial/outfitters/{controlNumber}';
	
	jsonData.response = jsonResponse;

	var cnData = noncommercial_data[1095010356];

	console.log('cnData='+cnData);

	if(cnData){

		console.log('data of accinstCn='+cnData.accinstCn);

		jsonResponse['success'] = true;
		
		var adminOrg = cnData.adminOrg;
		jsonData.controlNumber = cnData.accinstCn;
	    jsonData.region = adminOrg.slice(0, 2);
	    jsonData.forest = adminOrg.slice(2,4);
	    jsonData.district = adminOrg.slice(4,6);
	    jsonData.authorizingOfficerName = cnData.authOfficerName;
	    jsonData.authorizingOfficerTitle = cnData.authOfficerTitle;

	    var addressData = cnData.addresses[0];
	    var phoneData = cnData.phones[0];
	    var holderData = cnData.holders[0];

	    var applicantInfo = {};
	    var phoneNumber = {};
	    var noncommercialFields = {};
	    
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

	    if (addressData.contactType == 'ORGANIZATION'){
	    	applicantInfo.organizationName = addressData.contName;
	    }
	    else {
	    	applicantInfo.organizationName = null;	
	    }
	    applicantInfo.website = null;
	    applicantInfo.orgType = holderData.orgType;

	    noncommercialFields.activityDescription = cnData.purpose;
	    noncommercialFields.locationDescription = null;
	    noncommercialFields.startDateTime = '2017-04-12 09:00:00';
	    noncommercialFields.endDateTime = '2017-04-15 20:00:00';
		noncommercialFields.numberParticipants = 45;

	    jsonData['applicant-info'] = applicantInfo;
	    jsonData['noncommercial-fields'] = noncommercialFields;    
		
	}
	
    res.json(jsonData);
    

};

// put id

put.id = function(req,res){
    
    res.json(include('test/data/non-commercial.put.id.json'));

};

// post

post = function(req,res){

    var validate_res = validate_post_input(req);
    
    if(validate_res.fieldsValid){
    
        res.json(include('test/data/non-commercial.post.json'));
    
    }else{
    
        error.sendError(req,res,400,validate_res.error_message);
    
    }

};

function validate_post_input(req){
    
    var output = {
    
      'fieldsValid': true,
      'error_message': undefined
    
    };
    var error_array = [];

    if(_.isEmpty(req.body)){
    
        output.fieldsValid = false;
        output.error_message = 'Body cannot be empty.';
    
    }else if(_.isEmpty(req.body['applicant-info'])){
    
        output.fieldsValid = false;
        output.error_message = 'applicant-info field cannot be empty.';

    }else if (_.isEmpty(req.body['noncommercial-fields'])){

        output.fieldsValid = false;
        output.error_message = 'noncommercial-fields cannot be empty.';

    }else{

        var applicant_info = validate_special_use.applicant_info(req);
        var noncommercial = validate_noncommercial.noncommercial(req);

        if(!applicant_info.fields_valid){

            output.error_message = applicant_info.object_missing_message;
            
        }

        output.fieldsValid  = output.fieldsValid  && applicant_info.fields_valid;
        error_array = error_array.concat(applicant_info.error_array);

        output.fieldsValid  = output.fieldsValid  && noncommercial.fields_valid;
        error_array = error_array.concat(noncommercial.error_array);

        if(!output.error_message){
            output.error_message = util.build_error_message(error_array);
        }

    }

    return output;
}



//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
