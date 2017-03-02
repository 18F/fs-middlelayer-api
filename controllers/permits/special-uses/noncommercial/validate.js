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

var noncommercial = function(req){

    var output = {
        'fields_valid': true,
        'error_array':[]
    };

    if(_.isEmpty(req.body['noncommercial-fields'])){

        util.invalid_field(output, 'noncommercial-fields');

    }
    else{

        if (!req.body['noncommercial-fields'].activityDescription) {

            util.invalid_field(output, 'activityDescription');

        }
        if (!req.body['noncommercial-fields'].locationDescription) {

            util.invalid_field(output, 'locationDescription');

        }
        if (!req.body['noncommercial-fields'].startDateTime) {

            util.invalid_field(output, 'startDateTime');

        }
        if (!req.body['noncommercial-fields'].endDateTime) {

            util.invalid_field(output, 'endDateTime');

        }
        if (!req.body['noncommercial-fields'].numberParticipants) {

            util.invalid_field(output, 'numberParticipants');

        }
    
    }

    return output;

};

//*******************************************************************
// exports

module.exports.noncommercial = noncommercial;
