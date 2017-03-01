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

//*******************************************************************

var util = include('controllers/permits/special-uses/utility.js');

//*******************************************************************

var applicant_info = function(req){

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
    
        output.fields_valid = false;
        output.object_missing_message = 'dayPhone cannot be empty.';
    
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

//*******************************************************************
// exports

module.exports.applicant_info = applicant_info;
