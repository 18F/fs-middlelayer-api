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

var _ = require("lodash");

//*******************************************************************

function build_missing_error_message(error_array){

    var error_message = _.join(error_array, " and ");

    if (error_array.length > 1){

        error_message += " are required fields!";

    }
    else {

        error_message += " is a required field!";

    }

    return error_message;

}

function build_type_error_message(type_obj){

    var error_message = type_obj.field + " is expected to be type '" + type_obj.expected_type + "'.";
    return error_message;

}

function build_error_message(output){

    var missing_message = "", type_message = "", error_message = "";

    if (!_.isEmpty(output.missing_array)){

        missing_message = build_missing_error_message(output.missing_array);
        error_message = error_message + missing_message;

    }
    if (!_.isEmpty(output.type_array)){

        output.type_array.forEach((element)=>{

            type_message = type_message + build_type_error_message(element) + " ";

        });
        error_message = error_message + type_message;

    }
    
    return error_message;

}

var invalid_field = function (output, field){
    
    output.fields_valid = false;
    output.missing_array.push(field);

    return output;

};

var field_type = function (output, field, expected_type){
    
    output.fields_valid = false;
    output.type_array.push({

        "field":field,
        "expected_type":expected_type

    });

    return output;

};


//*******************************************************************
// exports

module.exports.build_error_message = build_error_message;
module.exports.invalid_field = invalid_field;
module.exports.field_type = field_type;
