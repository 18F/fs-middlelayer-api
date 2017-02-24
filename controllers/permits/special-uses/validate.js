/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

var permit_id = function(id){
    
    var valid = true;
    
    var id_str = ''+ id;
    
    if (id_str.length !== 10) {   
        valid = false;
    }
    
    return valid;

};

var applicant_info = function(req){

	var output = {
		'fields_valid': true,
		'error_array':[],
		'object_missing_message': undefined
	};

	if(!req.body['applicant-info'].firstName){
        output.fields_valid = false;
        output.error_array.push('firstName');
    }
    if(!req.body['applicant-info'].lastName){
        output.fields_valid = false;
        output.error_array.push('lastName');
    }
    if(!req.body['applicant-info'].dayPhone){
        output.fields_valid = false;
        output.object_missing = 'dayPhone cannot be empty!';
    }else{
        if(!req.body['applicant-info'].dayPhone.areaCode){
            output.fields_valid = false;
            output.error_array.push('dayPhone/areaCode');
        }
        if(!req.body['applicant-info'].dayPhone.number){
            output.fields_valid = false;
            output.error_array.push('dayPhone/number');
        }
        if(!req.body['applicant-info'].dayPhone.type){
            output.fields_valid = false;
            output.error_array.push('dayPhone/type');
        }
    }
    if(!req.body['applicant-info'].emailAddress){
        output.fields_valid = false;
        output.error_array.push('emailAddress');
    }
    if(!req.body['applicant-info'].mailingAddress){
        output.fields_valid = false;
        output.error_array.push('mailingAddress');
    }
    if(!req.body['applicant-info'].mailingCity){
        output.fields_valid = false;
        output.error_array.push('mailingCity');
    }
    if(!req.body['applicant-info'].mailingState){
        output.fields_valid = false;
        output.error_array.push('mailingState');
    }
    if(!req.body['applicant-info'].mailingZIP){
        output.fields_valid = false;
        output.error_array.push('mailingZIP');
    }

    return output;
};

//*******************************************************************
// exports

module.exports.permit_id = permit_id;
module.exports.applicant_info = applicant_info;
