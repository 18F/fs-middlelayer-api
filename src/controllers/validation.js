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
const Validator = require('jsonschema').Validator;
const include = require('include')(__dirname);
const dereferenceSchema = require('deref');

//*******************************************************************
// other files

const errors = require('./errors/patternErrorMessages.json');
const fileValidation = require('./fileValidation.js');

class ValidationClass {
	/**
	* @param  { Object } pathData - All data from swagger for the path that has been run
	* @param {Object} body - json body of the request being sent
	* @param  {Array}  errorArray - Array of all errors found so far
	* @param {Object} routeRequestSchema - schema of the particular route
	*/
	constructor(pathData, body){
		this.pathData = pathData;
		this.requiredFields = [];
		this.schemaValidator = new Validator();
		this.errorArray = [];
		this.routeRequestSchema = '';
		this.fullSchema = {};
		this.schemaToUse = {};
		this.body = body;
	}

	/** Get the schema to be used for validating user input
	 * @return {Object} schemas  - fullSchema is the full validation schemas for all permit types. schemaToUse is the validation schema for this route, schemaToGet path
	 */
	selectValidationSchema() {
		const fileToGet = `src/${this.pathData['x-validation'].split('#')[0]}`;
		const schemaToGet = this.pathData['x-validation'].split('#')[1];
		const applicationSchema = include(fileToGet);
		this.fullSchema = applicationSchema;
		this.schemaToUse = applicationSchema[schemaToGet];
		return {
			'fullSchema': applicationSchema,
			'schemaToUse': applicationSchema[schemaToGet],
			'schemaPath': schemaToGet
		};
	}
	/**
	 * Removes 'instance' from prop field of validation errors. Used to make fields human readable
	 *
	 * @param  {string} prop - Prop field from validation error
	 * @return {string}
	 */
	removeInstance(prop) {
		let fixedProp = '';
		if (prop.indexOf('.') !== -1) {
			fixedProp = prop.substring((prop.indexOf('.') + 1), (prop.length));
		}
		return fixedProp;
	}

 /**
 * Combines property and argument fields, if property exists, for missing field errors
 *
 * @param  {string} property - Upper field to combine
 * @param  {string} argument - Field where error is.
 * @return {string}          - Concatination of property, '.', and argument
 */
	combinePropArgument(property, argument) {

		let field;
		if (property.length > 0) {
			field = `${property}.${argument}`;
		}
		else {
			field = argument;
		}

		return field;

	}

	/**
	 * Creates error object which can be read by error message building function
	 *
	 * @param {string} field             - Field where error occured at
	 * @param {string} errorType         - Type of error returned
	 * @param {string} expectedFieldType - Type that the field is expected to be
	 * @param {string} enumMessage       - Enum message returned by validation
	 * @param {string} dependency        - Fields that are a dependeny of field
	 * @param {array} anyOfFields        - Array of strings of all field included in anyOf
	 *
	 * @return Error object
	 */
	makeErrorObject(field, errorType, expectedFieldType, enumMessage, dependency, anyOfFields) {
		const output = {
			field,
			errorType,
			expectedFieldType,
			enumMessage,
			dependency,
			anyOfFields
		};
		let key;
		for (key in output) {
			if (output[key] === null) {
				delete output[key];
			}
		}
		return output;
	}

	/**
	 * Checks for additional required fields if a missing field has sub fields, stores these fields in requiredFields
	 * @param  {Object} schema - schema to traverse in search for all required fields
	 */
	checkForExtraRequired(schema) {
		const keys = schema.properties;
		for (const key in keys) {
			if (schema.properties[key].type === 'object' && schema.required.includes(key)) {
				const indexOfSuper = this.requiredFields.indexOf(key) + 1;

				this.requiredFields.splice(indexOfSuper, 0, ...schema.properties[key].required.map(function (s) {
					return `${key}.${s}`;
				}));
				this.checkForExtraRequired(schema.properties[key]);
			}
		}
	}

	/** Traverses schema object in search of all fields listed as required. Stores all fields in requiredFiles array.
	 * @param  {Object} schema - schema to traverse in search for all required fields
	 */
	getAllRequired(schema) {
		const keys = Object.keys(schema);
		keys.forEach((key) => {
			switch (key) {
			case 'allOf':
				schema.allOf.forEach((sch) => {
					this.getAllRequired(sch);
				});
				break;
			case 'properties':
				this.getAllRequired(schema.properties);
				break;
			case 'required':
				this.requiredFields = this.requiredFields.concat(schema.required);
				this.checkForExtraRequired(schema);
			}
		});
	}

	/** Traverses through schema to find field specified. Once found it executes a function on that field in the schema.
	 * @param  {Object}   schema - schema to look for field in
	 * @param  {Array}    field  - Array(String) containing the path to the field to find
	 * @param  {Function} func   - Function to be run on the schema of field
	 */
	findField(schema, field, func) {
		const fieldCopy = JSON.parse(JSON.stringify(field));
		const schemaKeys = Object.keys(schema);
		schemaKeys.forEach((key) => {
			if (key === fieldCopy[0]) {
				if (fieldCopy.length === 1) {
					func(schema[key]);
				}
				else {
					fieldCopy.shift();
					this.findField(schema[key], fieldCopy, func);
				}
			}
			else {
				switch (key) {
				case 'allOf':
				case 'oneOf':
					schema[key].forEach((sch) => {
						this.findField(sch, fieldCopy, func);
					});
					break;
				case 'properties':
					this.findField(schema.properties, fieldCopy, func);
					break;
				}
			}
		});
	}

	/**
	 * Handles errors where a required field is missing.
	 * @param  {Object} output           - Object used to keep track of any errors, will be outputted if any found
	 * @param  {Array} output.errorArray - Array containing error objects which detail errors in schema
	 * @param  {Array} result  	         - Array of all errors from schema validator
	 * @param  {Number} counter          - Index of the current error
	 * @param  {Object} schema           - schema which input is being validated against
	 */
	handleMissingError(output, result, counter) {
		const property = this.removeInstance(result[counter].property);
		const field = this.combinePropArgument(property, result[counter].argument);

		output.errorArray.push(this.makeErrorObject(field, 'missing'));
		this.findField(this.routeRequestSchema, field.split('.'), this.getAllRequired);
		for (const i in this.requiredFields) {
			if (this.requiredFields.hasOwnProperty(i)) {
				this.requiredFields[i] = `${field}.${this.requiredFields[i]}`;
			}
		}
		this.requiredFields.forEach((requiredField) => {
			output.errorArray.push(this.makeErrorObject(requiredField, 'missing'));
		});
	}

	/**
	 * Handles errors where a field is the wrong type.
	 * @param  {Object} output           - Object used to keep track of any errors, will be outputted if any found
	 * @param  {Array} output.errorArray - Array containing error objects which detail errors in schema
	 * @param  {Array} result  	         - Array of all errors from schema validator
	 * @param  {Number} counter          - Index of the current error
	 */
	handleTypeError(output, result, counter) {

		const expectedType = result[counter].argument[0];
		const property = this.removeInstance(result[counter].property);
		output.errorArray.push(this.makeErrorObject(property, 'type', expectedType));

	}

	/**
	 * Handles errors where a field is formatted wrong.
	 * @param  {Object} output           - Object used to keep track of any errors, will be outputted if any found
	 * @param  {Array} output.errorArray - Array containing error objects which detail errors in schema
	 * @param  {Array} result  	         - Array of all errors from schema validator
	 * @param  {Number} counter          - Index of the current error
	 */
	handleFormatError(output, result, counter) {

		const field = `${this.removeInstance(result[counter].property)}`;
		output.errorArray.push(this.makeErrorObject(field, 'format'));

	}
	/**
	 * Handles errors where a field is not one of the enum values.
	 * @param  {Object} output            - Object used to keep track of any errors, will be outputted if any found
	 * @param  {Array}  output.errorArray - Array containing error objects which detail errors in schema
	 * @param  {Array}  result            - Array of all errors from schema validator
	 * @param  {Number} counter           - Index of the current error
	 */
	handleEnumError(output, result, counter) {

		const property = this.removeInstance(result[counter].property);
		output.errorArray.push(this.makeErrorObject(property, 'enum', null, result[counter].message));

	}

	/**
	 * Pulls the dependency of a certain field from the error message generated by the schema validator
	 * @param  {Array}  result  - Array of all errors from schema validator
	 * @param  {Number} counter - Index of the current error
	 */
	getDependency(result, counter) {

		const stackMessage = result[counter].stack;
		const dependency = stackMessage.split(' property ')[1].split(' not ')[0];
		return dependency;
	}

	/**
	 * Handles errors where a field has a dependency which is not provided.
	 * @param  {Object} output            - Object used to keep track of any errors, will be outputted if any found
	 * @param  {Array}  output.errorArray - Array containing error objects which detail errors in schema
	 * @param  {Array}  result            - Array of all errors from schema validator
	 * @param  {Number} counter           - Index of the current error
	 */
	handleDependencyError(output, result, counter){

		const error = result[counter];
		const dependentField = this.removeInstance(error.argument);
		const schemaPath = this.removeInstance(error.property);
		const dependency = `${schemaPath}.${this.getDependency(result, counter)}`;
		output.errorArray.push(this.this.makeErrorObject(dependentField, 'dependencies', null, null, dependency));

	}

	/**
	 * Creates error object for errors resulting from an anyOf section of the validation schema
	 *
	 * @param {Object} errorTracking            - Error object containing all error to report and the error message to deliver.
	 * @param {Array}  errorTracking.errorArray - Array contain all errors to report to user.
	 * @param {Array}  result                   - Array of errors found during validation.
	 * @param {Number} counter                  - Position in result that the current error being handled is.
	 */
	handleAnyOfError(errorTracking, result, counter){

		const error = result[counter];
		const property = this.removeInstance(error.property);
		const requiredOptions = [];
		error.schema.anyOf.forEach((fieldObj)=>{
			requiredOptions.push(this.combinePropArgument(property, fieldObj.required[0]));
		});
		errorTracking.errorArray.push(this.makeErrorObject(null, 'anyOf', null, null, null, requiredOptions));

	}

	/** Processes ValidationError into ErrorObj, extracting the info needed to create an error message
	 * @param  {Array} - Array of ValidationErrors from validation
	 * @param  {Array} - Array to store processed ErrorObjs in
	 */
	processErrors(errors, processedErrors){
		const length = errors.length;
		let counter;
		for (counter = 0; counter < length; counter++){

			switch (errors[counter].name){
			case 'required':
				this.handleMissingError(processedErrors, errors, counter);
				break;
			case 'type':
				this.handleTypeError(processedErrors, errors, counter);
				break;
			case 'format':
			case 'pattern':
				this.handleFormatError(processedErrors, errors, counter);
				break;
			case 'enum':
				this.handleEnumError(processedErrors, errors, counter);
				break;
			case 'dependencies':
				this.handleDependencyError(processedErrors, errors, counter);
				break;
			case 'anyOf':
				this.handleAnyOfError(processedErrors, errors, counter);
				break;
			}
		}
	}

	/** Validates the fields in user input
	 * @return {Array}                   - Array of ValidationErrors from validation
	 */
	validateBody(){
		for (const key in this.applicationSchema){
			if (this.applicationSchema.hasOwnProperty(key)) {
				this.schemaValidator.addSchema(this.applicationSchema[key], key);
			}
		}
		const val = this.schemaValidator.validate(this.body, this.schemaToUse);
		const error = val.errors;
		if (error.length > 0){
			this.processErrors(error);
		}
	}

	/**
	 * Takes input like fieldOne and converts it to Field One so that it is easier to read
	 * @param  {String} input - String to be made more readable
	 * @return {String}       - More readble string
	 */
	makeFieldReadable(input){

		return input
		.replace(/([A-Z])/g, ' $1')
		.replace(/^./, function(str){
			return str.toUpperCase();
		})
		.replace('Z I P', 'Zip')
		.replace('U R L', 'URL');

	}

	/**
	 * Takes input like fieldOne.fieldTwo and converts it to Field One/Field Two to make it easier to read
	 * @param  {String} input - path to field which has error
	 * @return {String}       - human readable path to errored field
	 */
	makePathReadable(input){

		if (typeof input === 'string'){
			const parts = input.split('.');
			const readableParts = [];
			let readablePath = '';
			parts.forEach((field)=>{
				readableParts.push(this.makeFieldReadable(field));
			});
			readablePath = readableParts.shift();
			readableParts.forEach((part)=>{
				readablePath = `${readablePath}/${part}`;
			});
			return readablePath;
		}
		else {
			return false;
		}

	}

	/**
	 * Creates error message for format errors
	 *
	 * @param  {String} fullPath - path to field where error is at
	 * @return {String}          - error message to be given to user
	 */
	buildFormatErrorMessage(fullPath){
		const field = fullPath.substring(fullPath.lastIndexOf('.') + 1);
		const readablePath = this.makePathReadable(fullPath);
		const errorMessage = `${readablePath}${errors[field]}`;
		return errorMessage;

	}

	/**
	 * Creates error message for anyOf errors
	 *
	 * @param  {array} anyOfFields - list of fields, at least one being required.
	 * @return {string}
	 */
	makeAnyOfMessage(anyOfFields){
		if (anyOfFields){
			let output, count = 1;
			const length = anyOfFields.length;
			output = `${this.makePathReadable(anyOfFields[0])}`;
			while (count < length) {
				const field = anyOfFields[count];
				output = `${output} or ${this.makePathReadable(field)}`;
				count ++;
			}
			return output;
		}
		else {
			return false;
		}
	}

	/**
	 * Combines all errors into one string which can be used to determine where all errors are at
	 * @param  {Array} errorMessages - Array of error objects
	 * @return {String}              - Error message containing all errors
	 */
	concatErrors(errorMessages){

		let output = '';
		errorMessages.forEach((message)=>{
			output = `${output}${message} `;
		});
		return output.trim();
	}

	/**
	 * Creates error messages for all field errors
	 * @param  {Object}  output            - Error object containing all error to report and the error message to deliver.
	 * @param  {Array}   output.errorArray - Array contain all errors to report to user.
	 * @param  {Object} error              - error object to be processed
	 * @param  {Array}  messages           - Array of all error messages to be returned
	 * @return {String}                    - All field error messages concated together
	 */
	generateErrorMesage(){

		let errorMessage = '';
		const messages = [];
		this.errorArray.forEach((error)=>{

			const missing = `${this.makePathReadable(error.field)} is a required field.`;
			const type = `${this.makePathReadable(error.field)} is expected to be type '${error.expectedFieldType}'.`;
			const enumMessage = `${this.makePathReadable(error.field)} ${error.enumMessage}.`;
			const dependencies = `Having ${this.makePathReadable(error.field)} requires that ${this.makePathReadable(error.dependency)} be provided.`;
			const anyOf = `Either ${this.makeAnyOfMessage(error.anyOfFields)} is a required field.`;
			const length = `${this.makePathReadable(error.field)} is too long, must be ${error.expectedFieldType} chracters or shorter`;

			switch (error.errorType){
			case 'missing':
				messages.push(missing);
				error.message = missing;
				break;
			case 'type':
				messages.push(type);
				error.message = type;
				break;
			case 'format':
			case 'pattern':
				messages.push(this.buildFormatErrorMessage(error.field));
				error.message = this.buildFormatErrorMessage(error.field);
				break;
			case 'enum':
				messages.push(enumMessage);
				error.message = enumMessage;
				break;
			case 'dependencies':
				messages.push(dependencies);
				error.message = dependencies;
				break;
			case 'anyOf':
				messages.push(anyOf);
				error.message = anyOf;
				break;
			case 'length':
				messages.push(length);
				error.message = length;
				break;
			default:
				fileValidation.generateFileErrors(error, messages);
				break;
			}
		});
		errorMessage = this.concatErrors(messages);
		return errorMessage;

	}

	/**
	 * Checks the length of all fields with a maxLength field in schema
	 * @param  {Object} schema                          - Section of the validation schema being used
	 * @param  {Object} input                           - User input being validated
	 * @param  {String} path                            - Path to field being checked
	 * @return {Array}                                  - Array of error objects representing all errors found so far
	 */
	checkFieldLengths(input, path){
		const keys = Object.keys(this.routeRequestSchema);
		keys.forEach((key)=>{
			switch (key){
			case 'allOf':
			case 'anyOf':
				this.routeRequestSchema[key].forEach((subSchema)=>{
					this.checkFieldLengths(subSchema, input, path);
				});
				break;
			case 'properties':
				this.checkFieldLengths(this.routeRequestSchema.properties, input, path);
				break;
			default:{
				let field;
				if (path === ''){
					field = `${key}`;
				}
				else {
					field = `${path}.${key}`;
				}
				if (this.routeRequestSchema[key].type === 'object'){
					if (input[key]){
						this.checkFieldLengths(this.routeRequestSchema[key], input[key], field);
					}
				}
				else if (this.routeRequestSchema[key].fromIntake){

					if (input){
						const maxLength = this.routeRequestSchema[key].maxLength;
						const fieldLength = `${input[key]}`.length;

						if (maxLength < fieldLength){

							this.errorArray.push(this.makeErrorObject(field, 'length', maxLength));
						}

					}

				}
				break;
			}
			}
		});
	}

	/**
	 * Checks that individualIsCitizen field is present if application is a temp-outfitters application and it is for an individual
	 * @param  {Object} input                - User input
	 */
	checkForIndividualIsCitizen(input){
		if (input.tempOutfitterFields && input.applicantInfo){
			if (!input.applicantInfo.orgType || input.applicantInfo.orgType.toUpperCase() === 'PERSON'){
				if ((typeof input.tempOutfitterFields.individualIsCitizen) !== 'boolean'){
					this.errorArray.push(this.makeErrorObject('tempOutfitterFields.individualIsCitizen', 'missing'));
				}
			}
		}
	}

	/**
	 * Checks that smallBusiness field is present if application is a temp-outfitters application and it is not for an individual
	 * @param  {Object} input                - User input
	 */
	checkForSmallBusiness(input){
		if (input.tempOutfitterFields && input.applicantInfo){
			if (input.applicantInfo.orgType && input.applicantInfo.orgType.toUpperCase() !== 'PERSON'){
				if ((typeof input.tempOutfitterFields.smallBusiness) !== 'boolean'){
					this.errorArray.push(this.makeErrorObject('tempOutfitterFields.smallBusiness', 'missing'));
				}
			}
		}
	}

	/**
	 * Checks that organizationName field is present if application is not for an individual
	 * @param  {Object} input                - User input
	 */
	checkForOrgName(input){
		if (input.applicantInfo){
			if (input.applicantInfo.orgType && input.applicantInfo.orgType.toUpperCase() !== 'PERSON'){
				if (!input.applicantInfo.organizationName || input.applicantInfo.organizationName.length <= 0){
					this.errorArray.push(this.makeErrorObject('applicantInfo.organizationName', 'missing'));
				}
			}
		}
	}

	/**
	 * Additional validation checks that can't be defined in the validation schema
	 */
	additionalValidation(){
		this.checkFieldLengths('');
		this.checkForOrgName();
		this.checkForIndividualIsCitizen();
		this.checkForSmallBusiness();
	}

	/**
	 * Drives validation of fields
	 * @param  {Object} validationSchema - schema to be used for validating input, same as validation.json without refs
	 * @return {Object}                  - Object containing an array of error objects for every error with fields
	 */
	getFieldValidationErrors(){

		this.validateBody();
		this.additionalValidation('');

		return this.errorArray;
	}

	validateInput(possbileFiles, req){
		this.selectValidationSchema();
		this.routeRequestSchema = dereferenceSchema(this.schemaToUse, [this.fullSchema], true);
		this.getFieldValidationErrors();

		//Files to validate are in possbileFiles
		fileValidation.checkForFilesInSchema(this.routeRequestSchema, possbileFiles);

		if (possbileFiles.length !== 0) {
			possbileFiles.forEach((fileConstraints) => {
				const key = Object.keys(fileConstraints)[0];
				const fileValidationErrors = fileValidation.validateFile(req.files[key], fileConstraints, key);
				this.errorArray = this.errorArray.concat(fileValidationErrors);
			});
		}
		const errorMessage = this.generateErrorMesage();
		return {'message': errorMessage, 'errorArray': this.errorArray};
	}

	validationHelper(dereferenceSchema) {
		this.selectValidationSchema();
		console.log('ValidHelpLog-s2u');
		console.log(this.schemaToUse);
		console.log('ValidHelpLog-full');
		console.log(this.fullSchema);
		this.routeRequestSchema = dereferenceSchema;
		console.log('ValidHelpLog-rrs');
		console.log(this.routeRequestSchema);
		this.getFieldValidationErrors();
		return this.errorArray;
	}
} // End of class

module.exports.ValidationClass = ValidationClass;
