/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

"use strict";

//*******************************************************************
// required modules

var include = require("include")(__dirname);
var noncommercial_data = require("../../../../test/data/basicGET.json");

//*******************************************************************
// validation

var validate_special_use = include("controllers/permits/special-uses/validate.js");
var error = include("error.js");


//*******************************************************************
// controller

var get = {};
var put = {};
var post;

// get all

get.all = function(){

    return include("test/data/non-commercial.get.all.json");

};

// get id

get.id = function(req, res){
    
    var jsonData = {};

    var jsonResponse = {};
    jsonResponse["success"] = false;
    jsonResponse["api"] = "FS ePermit API";
    jsonResponse["type"] = "controller";
    jsonResponse["verb"] = "get";
    jsonResponse["src"] = "json";
    jsonResponse["route"] = "permits/special-uses/commercial/outfitters/{controlNumber}";
    
    jsonData.response = jsonResponse;

    var cnData = noncommercial_data[1095010356];

    console.log("cnData=" + cnData);

    if (cnData){

        console.log("data of accinstCn=" + cnData.accinstCn);

        jsonResponse["success"] = true;
        
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

        if (addressData.contactType == "ORGANIZATION"){

            applicantInfo.organizationName = addressData.contName;
        
        }
        else {

            applicantInfo.organizationName = null;  
        
        }
        applicantInfo.website = null;
        applicantInfo.orgType = holderData.orgType;

        noncommercialFields.activityDescription = cnData.purpose;
        noncommercialFields.locationDescription = null;
        noncommercialFields.startDateTime = "2017-04-12 09:00:00";
        noncommercialFields.endDateTime = "2017-04-15 20:00:00";
        noncommercialFields.numberParticipants = 45;

        jsonData["applicant-info"] = applicantInfo;
        jsonData["noncommercial-fields"] = noncommercialFields;    
        
    }
    
    res.json(jsonData);

};

// put id

put.id = function(req, res){
    
    res.json(include("test/data/non-commercial.put.id.json"));

};

// post

post = function(req, res){

    var validate_res = validate_special_use.validate_input(req);
    
    if (validate_res.fields_valid){
    
        res.json(include("test/data/non-commercial.post.json"));
    
    }
    else {
    
        error.sendError(req, res, 400, validate_res.error_message);
    
    }

};

//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
