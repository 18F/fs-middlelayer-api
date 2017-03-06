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
var Validator = require("jsonschema").Validator;

//*******************************************************************

var util = include("controllers/permits/special-uses/utility.js");
var v = new Validator();

//*******************************************************************
// schemas

var outfitter_schema = {

    "id":"temp-outfitter-permit",
    "type":"object",
    "properties":{
        "region": { "type" : "integer" },
        "forest": { "type" : "integer" },
        "district": { "type" : "integer" },
        "authorizingOfficerName": { "type" : "string"},
        "authorizingOfficerTitle": { "type" : "string"},
        "applicant-info": {
            "$ref": "applicant-info-temp-outfitter"
        },
        "type": {
            "type": "string", 
            "default": "temp-outfitter-guide",
            "enum":[
                "noncommercial",
                "temp-outfitter-guide"
            ]
        },
        "temp-outfitter-fields": {
            "$ref": "temp-outfitter-fields"
        }
    },
    "required": ["region", "forest", "district", "applicant-info", "type", "temp-outfitter-fields"]

};

var applicant_info_temp_outfitter = {

    "id": "/applicant-info-temp-outfitter",
    "type": "object",
    "properties": {
        "firstName": { "type": "string" },
        "lastName": { "type": "string" },
        "dayPhone": { "$ref": "phone-number" },
        "eveningPhone": { "$ref": "phone-number" },
        "emailAddress": { "type": "string" },
        "mailingAddress": { "type": "string" },
        "mailingAddress2": { "type": "string" },
        "mailingCity": { "type": "string" },
        "mailingState": { "type": "string" },
        "mailingZIP": { "type": "integer" },
        "organizationName": { "type": "string"},
        "website":{"type": "string"},
        "orgType":{
            "type":"string",
            "description":"Organization Type",
            "enum":[
                "Individual",
                "Corporation",
                "Limited Liability Company",
                "Partnership or Association",
                "State Government or Agency",
                "Local Government or Agency",
                "Nonprofit"
            ]
        }            
    },
    "required": ["firstName", "lastName", "dayPhone", "emailAddress", "mailingAddress", "mailingCity", "mailingZIP", "mailingState", "orgType"]

};

var temp_outfitter_fields = {

    "id": "/temp-outfitter-fields",
    "type": "object",
    "properties": {
        "activityDescription": { "type": "string"},
        "locationDescription": {  "type": "string"},
        "startDateTime": { "type": "string"},
        "endDateTime": { "type": "string"},
        "insuranceCertificate": { "type": "string"},
        "goodStandingEvidence": {
            "description": "Certificate of good standing, operating agreement, or other evidence the business is in good standing",
            "type": "string"
        },
        "operatingPlan": {
            "description": "A completed Word or RTF operating plan template.",
            "type": "string"
        }
    },
    "required": ["activityDescription", "locationDescription", "startDateTime", "endDateTime", "insuranceCertificate", "goodStandingEvidence", "operatingPlan"]

};

var noncommercial_schema = {

    "id":"temp-outfitter-permit",
    "type":"object",
    "properties":{
        "region": { "type" : "integer" },
        "forest": { "type" : "integer" },
        "district": { "type" : "integer" },
        "authorizingOfficerName": { "type" : "string"},
        "authorizingOfficerTitle": { "type" : "string"},
        "applicant-info": {
            "$ref": "applicant-info-non-commercial"
        },
        "type": {
            "type": "string", 
            "default": "noncommercial",
            "enum":[
                "noncommercial",
                "temp-outfitter-guide"
            ]
        },
        "noncommercial-fields": {
            "$ref": "non-commercial-fields"
        }
    },
    "required": ["region", "forest", "district", "applicant-info", "type", "noncommercial-fields"]

};

var applicant_info_non_commercial = {

    "id": "/applicant-info-non-commercial",
    "type": "object",
    "properties": {
        "firstName": { "type": "string" },
        "lastName": { "type": "string" },
        "dayPhone": { "$ref": "phone-number" },
        "eveningPhone": { "$ref": "phone-number" },
        "emailAddress": { "type": "string" },
        "mailingAddress": { "type": "string" },
        "mailingAddress2": { "type": "string" },
        "mailingCity": { "type": "string" },
        "mailingState": { "type": "string" },
        "mailingZIP": { "type": "integer" },
        "organizationName": { "type": "string"},
        "website":{"type": "string"},
        "orgType":{
            "type":"string",
            "description":"Organization Type",
            "enum":[
                "Individual",
                "Corporation",
                "Limited Liability Company",
                "Partnership or Association",
                "State Government or Agency",
                "Local Government or Agency",
                "Nonprofit"
            ]
        }            
    },
    "required": ["firstName", "lastName", "dayPhone", "emailAddress", "mailingAddress", "mailingCity", "mailingZIP", "mailingState"]

};

var non_commercial_fields = {

    "id": "/non-commercial-fields",
    "type": "object",
    "properties": {
        "activityDescription": { "type": "string"},
        "locationDescription": {  "type": "string"},
        "startDateTime": { "type": "string"},
        "endDateTime": { "type": "string"}
    },
    "required": ["activityDescription", "locationDescription", "startDateTime", "endDateTime", "numberParticipants"]

};


var phone_number = {

    "id": "/phone-number",
    "type": "object",
    "properties": {
        "areaCode": { "type": "integer"},
        "number": { "type": "integer"},
        "extension": { "type": "integer"},
        "type": {"type": "string"}
    },
    "required": ["areaCode", "number", "type"]

};

//*******************************************************************

function remove_instance(prop){

    var fixed_prop;
    if (prop.indexOf(".") !== -1){

        fixed_prop = prop.substring((prop.indexOf(".") + 1), (prop.length));

    }
    else {

        fixed_prop = "";

    }

    return fixed_prop;

}

function get_route(req){

    var path = req.originalUrl;
    var parts = path.split("/");
    var route;
    if (path.charAt(path.length - 1) === "/"){

        route = parts[parts.length - 2];

    }
    else {

        route = parts[parts.length - 1];

    }

    return route;

}

function handle_missing_error(output, property, field, result, counter){

    property = remove_instance(result[counter].property);
    if (property.length > 0){

        field = property + "." + result[counter].argument;

    }
    else {

        field = result[counter].argument;

    }
    util.invalid_field(output, field);

}

var validate_input = function (req){

    var route = get_route(req);
    var output = {
    
        "fields_valid": true,
        "error_message": "",
        "error_array": []

    };
    var result, length, type_arr = [], property, field, counter;
    v.addSchema(phone_number, "phone-number");
    if (route === "noncommercial"){

        v.addSchema(applicant_info_non_commercial, "applicant-info-non-commercial");
        v.addSchema(non_commercial_fields, "non-commercial-fields");
        result = v.validate(req.body, noncommercial_schema).errors;
                   

    }
    else { 

        v.addSchema(applicant_info_temp_outfitter, "applicant-info-temp-outfitter");
        v.addSchema(temp_outfitter_fields, "temp-outfitter-fields");
        result = v.validate(req.body, outfitter_schema).errors;
        

    }

    type_arr = [];
    length = result.length;
    for (counter = 0; counter < length; counter++){

        if (result[counter].name === "required"){

            handle_missing_error(output, property, field, result, counter);

        }
        else if (result[counter].name === "type"){

            type_arr.push(remove_instance(result[counter].property));

        }

    }


    output.error_message = util.build_error_message(output.error_array);
    return output;

};


//*******************************************************************
// exports

module.exports.validate_input = validate_input;
