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

const include = require('include')(__dirname);
const Validator = require('jsonschema').Validator;

//*******************************************************************

const util = include('controllers/permits/special-uses/utility.js');
const schema = require('./validation_schema.json');
const v = new Validator();

//*******************************************************************
// schemas

const outfitter_schema = schema.outfitter;
const applicant_info_temp_outfitter = schema.outfitter_applicant_info;
const temp_outfitter_fields = schema.temp_outfitter_fields;
const noncommercial_schema = schema.noncommercial;
const applicant_info_noncommercial = schema.noncommercial_applicant_info;
const noncommercial_fields = schema.noncommercial_fields;
const phone_number = schema.phone_number;

//*******************************************************************

function remove_instance(prop){

	let fixed_prop = '';
	if (prop.indexOf('.') !== -1){

		fixed_prop = prop.substring((prop.indexOf('.') + 1), (prop.length));

	}

	return fixed_prop;

}

function get_route(req){

	let path = req.originalUrl;
	let parts = path.split('/');
	let route;
	if (path.charAt(path.length - 1) === '/'){

		route = parts[parts.length - 2];

	}
	else {

		route = parts[parts.length - 1];

	}

	return route;

}

function combine_prop_argument(property, argument){

	let field;
	if (property.length > 0){

		field = property + '.' + argument;

	}
	else {

		field = argument;

	}

	return field;

}

function handle_missing_error(output, result, counter){

	let field;
	let property = remove_instance(result[counter].property);
	field = combine_prop_argument(property, result[counter].argument);
	util.invalid_field(output, field);

}

function handle_type_error(output, result, counter){

	let property;
	let expected_type = result[counter].argument[0];
	property = remove_instance(result[counter].property);
	util.field_type(output, property, expected_type);

}

const validate_input = function (req){

	let route = get_route(req);
	let output = {
    
		'fields_valid': true,
		'error_message': '',
		'missing_array': [],
		'type_array': []

	};
	let result, length, counter;
	v.addSchema(phone_number, 'phone-number');
	v.addSchema(applicant_info_noncommercial, 'applicant-info-noncommercial');
	v.addSchema(noncommercial_fields, 'noncommercial-fields');
	v.addSchema(applicant_info_temp_outfitter, 'applicant-info-temp-outfitter');
	v.addSchema(temp_outfitter_fields, 'temp-outfitter-fields');
	if (route === 'noncommercial'){

		result = v.validate(req.body, noncommercial_schema).errors;                   

	}
	else { 

		result = v.validate(req.body, outfitter_schema).errors;        

	}

	length = result.length;
	for (counter = 0; counter < length; counter++){

		if (result[counter].name === 'required'){

			handle_missing_error(output, result, counter);

		}
		else {

			handle_type_error(output, result, counter);

		}

	}

	output.error_message = util.build_error_message(output);
	//console.log('validate_input output='+output);
	return output;

};

//*******************************************************************
// exports

module.exports.validate_input = validate_input;
