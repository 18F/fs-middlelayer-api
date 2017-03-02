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

//*******************************************************************

var validate_noncommercial = include('controllers/permits/special-uses/noncommercial/validate.js');
var validate_outfitters = include('controllers/permits/special-uses/commercial/outfitters/validate.js');
var util = include('controllers/permits/special-uses/utility.js');

//*******************************************************************

var validate_applicant_info = function(req){

    var output = {
        'fields_valid': true,
        'error_array':[],
        'object_missing_message': undefined
    };

    if(!req.body['applicant-info'].firstName){

        util.invalid_field(output, 'firstName');
    
    }
    if(!req.body['applicant-info'].lastName){
    
        util.invalid_field(output, 'lastName');
    
    }
    if(!req.body['applicant-info'].dayPhone){
    
        util.invalid_field(output, 'dayPhone');
    
    }
    else{
    
        var phone_res = validate_day_phone(req);
        output.fields_valid = output.fields_valid && phone_res.fields_valid;
        output.error_array =  output.error_array.concat(phone_res.error_array);
    
    }
    if(!req.body['applicant-info'].emailAddress){
    
        util.invalid_field(output, 'emailAddress');
    
    }
    var mailing_info_res = validate_mailing_info(req);
    
    output.fields_valid = output.fields_valid && mailing_info_res.fields_valid;
    output.error_array =  output.error_array.concat(mailing_info_res.error_array);

    return output;

};

function validate_day_phone(req){

    var output = {
        'fields_valid': true,
        'error_array':[]
    };
    if(!req.body['applicant-info'].dayPhone.areaCode){

        util.invalid_field(output, 'dayPhone/areaCode');

    }
    if(!req.body['applicant-info'].dayPhone.number){

        util.invalid_field(output, 'dayPhone/number');

    }
    if(!req.body['applicant-info'].dayPhone.type){

        util.invalid_field(output, 'dayPhone/type');

    }
    return output;

}

function validate_mailing_info(req){

    var output = {
        'fields_valid': true,
        'error_array': []
    };

    if(!req.body['applicant-info'].mailingAddress){

        util.invalid_field(output, 'mailingAddress');

    }
    if(!req.body['applicant-info'].mailingCity){

        util.invalid_field(output, 'mailingCity');

    }
    if(!req.body['applicant-info'].mailingState){

        util.invalid_field(output, 'mailingState');

    }
    if(!req.body['applicant-info'].mailingZIP){

        util.invalid_field(output, 'mailingZIP');

    }

    return output;

}

var validate_input = function (req){

    var route = get_route(req);

    var output = {
    
        'fields_valid': true,
        'error_message': undefined,
        'error_array': []

    };
    var permit_specific;
    var applicant_info;

    if(_.isEmpty(req.body)){
    
        util.invalid_field(output, 'Body');
    
    }
    else if(_.isEmpty(req.body['applicant-info'])){
        
        util.invalid_field(output, 'applicant-info');

    }
    else{

        applicant_info = validate_applicant_info(req);
        output.fields_valid  = output.fields_valid  && applicant_info.fields_valid;
        output.error_array = output.error_array.concat(applicant_info.error_array);

        if(!applicant_info.fields_valid){

            output.error_message = applicant_info.object_missing_message;
            
        }
        if(route === 'noncommercial'){

            permit_specific = validate_noncommercial.noncommercial(req);
            

        }
        else if(route === 'outfitters'){

            permit_specific = validate_outfitters.outfitters(req);

        }

        output.fields_valid  = output.fields_valid  && permit_specific.fields_valid;
        output.error_array = output.error_array.concat(permit_specific.error_array);

    }

    output.error_message = util.build_error_message(output.error_array);
    return output;

};

function get_route(req){

    var path = req.originalUrl;
    var parts = path.split('/');
    var route;
    if(path.charAt(path.length-1) === '/'){

        route = parts[parts.length-2];

    }
    else{

        route = parts[parts.length-1];

    }

    return route;

}


//*******************************************************************
// exports

module.exports.validate_input = validate_input;
