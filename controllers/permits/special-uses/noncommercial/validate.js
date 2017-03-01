/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

var noncommercial = function(req){

	var output = {
		'fields_valid': true,
		'error_array':[]
	};

	if (!req.body['noncommercial-fields'].activityDescription) {
        output.fields_valid = false;
        output.error_array.push('activityDescription');
    }
    if (!req.body['noncommercial-fields'].locationDescription) {
        output.fields_valid = false;
        output.error_array.push('locationDescription');
    }
    if (!req.body['noncommercial-fields'].startDateTime) {
        output.fields_valid = false;
        output.error_array.push('startDateTime');
    }
    if (!req.body['noncommercial-fields'].endDateTime) {
        output.fields_valid = false;
        output.error_array.push('endDateTime');
    }
    if (!req.body['noncommercial-fields'].numberParticipants) {
        output.fields_valid = false;
        output.error_array.push('numberParticipants');
    }

    return output;
};

//*******************************************************************
// exports

module.exports.noncommercial = noncommercial;