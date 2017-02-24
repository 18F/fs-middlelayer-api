/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

var outfitters = function(req){

    var output = {
        'fields_valid': true,
        'error_array':[]
    };
    if(!req.body['applicant-info'].orgType){
        output.fields_valid = false;
        output.error_array.push('orgType');
    }
    if (!req.body['temp-outfitter-fields'].activityDescription) {
        output.fields_valid = false;
        output.error_array.push('activityDescription');
    }
    if (!req.body['temp-outfitter-fields'].locationDescription) {
        output.fields_valid = false;
        output.error_array.push('locationDescription');
    }
    if (!req.body['temp-outfitter-fields'].startDateTime) {
        output.fields_valid = false;
        output.error_array.push('startDateTime');
    }
    if (!req.body['temp-outfitter-fields'].endDateTime) {
        output.fields_valid = false;
        output.error_array.push('endDateTime');
    }
    if (!req.body['temp-outfitter-fields'].insuranceCertificate) {
        output.fields_valid = false;
        output.error_array.push('insuranceCertificate');
    }
    if (!req.body['temp-outfitter-fields'].goodStandingEvidence) {
        output.fields_valid = false;
        output.error_array.push('goodStandingEvidence');
    }
    if (!req.body['temp-outfitter-fields'].operatingPlan) {
        output.fields_valid = false;
        output.error_array.push('operatingPlan');
    }

    return output;
};

//*******************************************************************
// exports

module.exports.outfitters = outfitters;