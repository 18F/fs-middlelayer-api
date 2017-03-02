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

var util = include('controllers/permits/special-uses/utility.js');

//*******************************************************************

var outfitters = function(req){

    var output = {
        'fields_valid': true,
        'error_array':[]
    };

    if(!req.body['applicant-info'].orgType){

        util.invalid_field(output, 'orgType');

    }
        
    if(_.isEmpty(req.body['temp-outfitter-fields'])){

        util.invalid_field(output, 'temp-outfitter-fields');

    }
    else{

        if (!req.body['temp-outfitter-fields'].activityDescription) {

            util.invalid_field(output, 'activityDescription');

        }
        if (!req.body['temp-outfitter-fields'].locationDescription) {

            util.invalid_field(output, 'locationDescription');

        }
        if (!req.body['temp-outfitter-fields'].startDateTime) {

            util.invalid_field(output, 'startDateTime');

        }
        if (!req.body['temp-outfitter-fields'].endDateTime) {

            util.invalid_field(output, 'endDateTime');

        }

        var files_res = validate_files(req);
        output.fields_valid = output.fields_valid && files_res.fields_valid;
        output.error_array =  output.error_array.concat(files_res.error_array);
    
    }
    

    return output;

};

function validate_files (req){

    var output = {
        'fields_valid': true,
        'error_array':[]
    };

    if (!req.body['temp-outfitter-fields'].insuranceCertificate) {

        util.invalid_field(output, 'insuranceCertificate');

    }
    if (!req.body['temp-outfitter-fields'].goodStandingEvidence) {

        util.invalid_field(output, 'goodStandingEvidence');

    }
    if (!req.body['temp-outfitter-fields'].operatingPlan) {

        util.invalid_field(output, 'operatingPlan');

    }

    return output;

}

//*******************************************************************
// exports

module.exports.outfitters = outfitters;
