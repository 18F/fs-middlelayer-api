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
const deref = require('deref');
const dereferenceSchema = deref();

//*******************************************************************
// other files

const errors = require('./errors/patternErrorMessages.json');
const fileValidation = require('./fileValidation.js');
const utility = require('./utility.js');

class ValidationClass {
	/**
	* @param  { Object } pathData - All data from swagger for the path that has been run
	* @param {Object} body - json body of the request being sent
	* @param  {Array}  errorArray - Array of all errors found so far
	* @param {Object} routeRequestSchema - schema of the particular route
	*/
	constructor(pathData, body){
		this.pathData = pathData;
		this.schemaValidator = new Validator();
		this.errorArray = [];
		this.routeRequestSchema = '';
		this.fullSchema = {};
		this.schemaToUse = {};
		this.requiredFields = [];
		this.body = body;
	}

	/** Get the schema to be used for validating user input
	 * @return {Object} schemas  - fullSchema is the full validation schemas for all permit types. schemaToUse is the validation schema for this route, schemaToGet path
	 */
	selectValidationSchema() {
		const validationSchemaFile = `src/${this.pathData['x-validation'].split('#')[0]}`;
		const schemaToGet = this.pathData['x-validation'].split('#')[1];
		const validationSchema = include(validationSchemaFile);
		this.fullSchema = validationSchema;
		this.schemaToUse = validationSchema[schemaToGet];
		return {
			'fullSchema': validationSchema,
			'schemaToUse': validationSchema[schemaToGet]
		};
	}
	/**
	 * Removes label'instance' from 'property' field of validation errors. Used to make fields human readable
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
		const errorObject = {
			field,
			errorType,
			expectedFieldType,
			enumMessage,
			dependency,
			anyOfFields
		};
		for (const key in errorObject) {
			if (errorObject[key] === null) {
				delete errorObject[key];
			}
		}
		return errorObject;
	}

	/**
	 * Checks for additional required fields if a missing field has sub fields, stores these fields in requiredFields
	 * @param  {Object} schema - schema to traverse in search for all required fields
	 */
	checkForExtraRequired(schema) {
		const keys = schema.properties;
		const self = this;
		for (const key in keys) {
			if (schema.properties[key].type === 'object' && schema.required.includes(key)) {
				const indexOfSuper = self.requiredFields.indexOf(key) + 1;

				self.requiredFields.splice(indexOfSuper, 0, ...schema.properties[key].required.map(function (s) {
					return `${key}.${s}`;
				}));
				self.checkForExtraRequired(schema.properties[key]);
			}
		}
	}

	/** Traverses schema object in search of all fields listed as required. Stores all fields in requiredFiles array.
	 * @param  {Object} schema - schema to traverse in search for all required fields
	 */
	getAllRequired(schema) {
		const keys = Object.keys(schema);
		const self = this;
		keys.forEach((key) => {
			switch (key) {
			case 'allOf':
				schema.allOf.forEach((sch) => {
					self.getAllRequired(sch);
				});
				break;
			case 'properties':
				self.getAllRequired(schema.properties);
				break;
			case 'required':
				self.requiredFields = self.requiredFields.concat(schema.required);
				self.checkForExtraRequired(schema);
			}
		});
	}

	/** Traverses through schema to find field specified. Once found it executes a function on that field in the schema.
	 * @param  {Object}   schema - schema to look for field in
	 * @param  {Array}    field  - Array(String) containing the path to the field to find
	 */
	findField(schema, field) {
		const fieldCopy = JSON.parse(JSON.stringify(field));
		const schemaKeys = Object.keys(schema);
		schemaKeys.forEach((key) => {
			if (key === fieldCopy[0]) {
				if (fieldCopy.length === 1) {
					this.getAllRequired(schema[key]);
				}
				else {
					fieldCopy.shift();
					this.findField(schema[key], fieldCopy);
				}
			}
			else {
				switch (key) {
				case 'allOf':
				case 'oneOf':
					schema[key].forEach((sch) => {
						this.findField(sch, fieldCopy);
					});
					break;
				case 'properties':
					this.findField(schema.properties, fieldCopy);
					break;
				}
			}
		});
	}

	/**
	 * Handles errors where a required field is missing.
	 * @param  {Object} missingError  - Missing Field Validation Errror object
	 */
	handleMissingError(missingError) {
		const field = this.combinePropArgument(missingError.cleanProperty, missingError.argument);
		const self = this;
		self.errorArray.push(this.makeErrorObject(field, 'missing'));
		self.findField(this.routeRequestSchema, field.split('.'));
		for (const i in self.requiredFields) {
			if (self.requiredFields.hasOwnProperty(i)) {
				self.requiredFields[i] = `${field}.${self.requiredFields[i]}`;
			}
		}
		self.requiredFields.forEach((requiredField) => {
			self.errorArray.push(self.makeErrorObject(requiredField, 'missing'));
		});
	}

	/**
	 * Handles errors where a field is the wrong type.
	  * @param  {Object} typeError  - Object of wrong type for a field from validation schema
	 */
	handleTypeError(typeError) {
		const expectedType = typeError.argument[0];
		this.errorArray.push(this.makeErrorObject(typeError.cleanProperty, 'type', expectedType));

	}

	/**
	 * Handles errors where a field is formatted wrong.
	 * @param  {Object} formatError  - Object of wrong formatting for a field from validation schema
	 */
	handleFormatError(formatError) {
		this.errorArray.push(this.makeErrorObject(formatError.cleanProperty, 'format'));
	}
	/**
	 * Handles errors where a field is not one of the enum values.
	 * @param  {Object} enumError  - Object of value not in enum for a field from validation schema
	 */
	handleEnumError(enumError) {
		this.errorArray.push(this.makeErrorObject(enumError.cleanProperty, 'enum', null, enumError.message));

	}

	/**
	 * Handles errors where a field has a dependency which is not provided.
	 * @param  {Array}  result            - Array of all errors from schema validator
	 * @param  {Number} counter           - Index of the current error
	 */
	handleDependencyError(dependencyError){
		const dependentField = this.removeInstance(dependencyError.argument);
		const dependencyPath = dependencyError.stack.split(' property ')[1].split(' not ')[0];
		const dependency = `${dependencyError.cleanProperty}.${dependencyPath}`;
		this.errorArray.push(this.makeErrorObject(dependentField, 'dependencies', null, null, dependency));

	}

	/**
	 * Creates error object for errors resulting from an anyOf section of the validation schema
	 * @param  {Object} anyOfError  - Object of value not in anyOf for a field from validation schema
	 */
	handleAnyOfError(anyOfError){
		const requiredOptions = [];
		anyOfError.schema.anyOf.forEach((fieldObj)=>{
			requiredOptions.push(this.combinePropArgument(anyOfError.cleanProperty, fieldObj.required[0]));
		});
		this.errorArray.push(this.makeErrorObject(null, 'anyOf', null, null, null, requiredOptions));

	}

	/** Processes ValidationError into ErrorObj, extracting the info needed to create an error message
	 * @param  {Array} - Array of ValidationErrors from validation
	 */
	processErrors(errors){
		const length = errors.length;
		for (let counter = 0; counter < length; counter++){
			const currentError = errors[counter];
			currentError.cleanProperty = this.removeInstance(currentError.property);
			switch (currentError.name){
			case 'required':
				this.handleMissingError(currentError);
				break;
			case 'type':
				this.handleTypeError(currentError);
				break;
			case 'format':
			case 'pattern':
				this.handleFormatError(currentError);
				break;
			case 'enum':
				this.handleEnumError(currentError);
				break;
			case 'dependencies':
				this.handleDependencyError(currentError);
				break;
			case 'anyOf':
				this.handleAnyOfError(currentError);
				break;
			}
		}
	}

	/** Validates the fields in user input
	 * @return {Array}                   - Array of ValidationErrors from validation
	 */
	validateBody(){
		for (const key in this.fullSchema){
			if (this.fullSchema.hasOwnProperty(key)) {
				this.schemaValidator.addSchema(this.fullSchema[key], key);
			}
		}
		const validationSchemaResult = this.schemaValidator.validate(this.body, this.schemaToUse);
		if (validationSchemaResult.errors.length > 0){
			this.processErrors(validationSchemaResult.errors);
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
		const readablePath = utility.makePathReadable(fullPath);
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
			let count = 1;
			const length = anyOfFields.length;
			let message = `${utility.makePathReadable(anyOfFields[0])}`;
			while (count < length) {
				const field = anyOfFields[count];
				message = `${message} or ${utility.makePathReadable(field)}`;
				count ++;
			}
			return message;
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

		let errMessage = '';
		errorMessages.forEach((message)=>{
			errMessage = `${errMessage}${message} `;
		});
		return errMessage.trim();
	}

	/**
	 * Creates error messages for all field errors
	 * @param  {Object} error              - error object to be processed
	 * @param  {Array}  messages           - Array of all error messages to be returned
	 * @return {String}                    - All field error messages concated together
	 */
	generateErrorMessage(){

		let errorMessage = '';
		const messages = [];
		const self = this;
		self.errorArray.forEach((validationError)=>{

			const missing = `${utility.makePathReadable(validationError.field)} is a required field.`;
			const type = `${utility.makePathReadable(validationError.field)} is expected to be type '${validationError.expectedFieldType}'.`;
			const enumMessage = `${utility.makePathReadable(validationError.field)} ${validationError.enumMessage}.`;
			const dependencies = `Having ${utility.makePathReadable(validationError.field)} requires that ${utility.makePathReadable(validationError.dependency)} be provided.`;
			const anyOf = `Either ${self.makeAnyOfMessage(validationError.anyOfFields)} is a required field.`;
			const length = `${utility.makePathReadable(validationError.field)} is too long, must be ${validationError.expectedFieldType} chracters or shorter`;

			switch (validationError.errorType){
			case 'missing':
				messages.push(missing);
				break;
			case 'type':
				messages.push(type);
				validationError.message = type;
				break;
			case 'format':
			case 'pattern':
				messages.push(self.buildFormatErrorMessage(validationError.field));
				validationError.message = self.buildFormatErrorMessage(validationError.field);
				break;
			case 'enum':
				messages.push(enumMessage);
				validationError.message = enumMessage;
				break;
			case 'dependencies':
				messages.push(dependencies);
				validationError.message = dependencies;
				break;
			case 'anyOf':
				messages.push(anyOf);
				validationError.message = anyOf;
				break;
			case 'length':
				messages.push(length);
				validationError.message = length;
				break;
			default:
				validationError.message = fileValidation.generateFileErrors(validationError);
				messages.push(validationError.message);
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
	 * @param  {Object} processedFieldErrors            - Current object containing errors
	 * @param  {Array}  processedFieldErrors.errorArray - Array of all errors found so far
	 * @param  {String} path                            - Path to field being checked
	 * @return {Array}                                  - Array of error objects representing all errors found so far
	 */
	checkFieldLengths(schema, input, path) {
		const keys = Object.keys(schema);
		const self = this;
		keys.forEach((key) => {
			switch (key) {
			case 'allOf':
			case 'anyOf':
				schema[key].forEach((sch) => {
					self.checkFieldLengths(sch, input, path);
				});
				break;
			case 'properties':
				self.checkFieldLengths(schema.properties, input, path);
				break;
			default: {
				let field;
				if (path === '') {
					field = `${key}`;
				}
				else {
					field = `${path}.${key}`;
				}
				if (schema[key].type === 'object') {
					if (input[key]) {
						self.checkFieldLengths(schema[key], input[key], field);
					}
				}
				else if (schema[key].fromIntake) {

					if (input) {
						const maxLength = schema[key].maxLength;
						const fieldLength = `${input[key]}`.length;

						if (maxLength < fieldLength) {

							self.errorArray.push(self.makeErrorObject(field, 'length', maxLength));
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
	checkForIndividualIsCitizen(){
		if (this.body.tempOutfitterFields && this.body.applicantInfo){
			if (!this.body.applicantInfo.orgType || this.body.applicantInfo.orgType.toUpperCase() === 'PERSON'){
				if ((typeof this.body.tempOutfitterFields.individualIsCitizen) !== 'boolean'){
					this.errorArray.push(this.makeErrorObject('tempOutfitterFields.individualIsCitizen', 'missing'));
				}
			}
		}
	}

	/**
	 * Checks that smallBusiness field is present if application is a temp-outfitters application and it is not for an individual
	 * @param  {Object} input                - User input
	 */
	checkForSmallBusiness(){
		if (this.body.tempOutfitterFields && this.body.applicantInfo){
			if (this.body.applicantInfo.orgType && this.body.applicantInfo.orgType.toUpperCase() !== 'PERSON'){
				if ((typeof this.body.tempOutfitterFields.smallBusiness) !== 'boolean'){
					this.errorArray.push(this.makeErrorObject('tempOutfitterFields.smallBusiness', 'missing'));
				}
			}
		}
	}

	/**
	 * Checks that organizationName field is present if application is not for an individual
	 * @param  {Object} input                - User input
	 */
	checkForOrgName(){
		if (this.body.applicantInfo){
			if (this.body.applicantInfo.orgType && this.body.applicantInfo.orgType.toUpperCase() !== 'PERSON'){
				if (!this.body.applicantInfo.organizationName || this.body.applicantInfo.organizationName.length <= 0){
					this.errorArray.push(this.makeErrorObject('applicantInfo.organizationName', 'missing'));
				}
			}
		}
	}

	/**
	 * Additional validation checks that can't be defined in the validation schema
	 */
	additionalValidation(){
		this.checkFieldLengths(this.routeRequestSchema, this.body, '');
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
				const fileValidationErrors = fileValidation.validateFile(req.files[key], fileConstraints, key, this);
				
				this.errorArray = this.errorArray.concat(fileValidationErrors);
			});
		}
		const errorMessage = this.generateErrorMessage();
		return {'message': errorMessage, 'errorArray': this.errorArray, 'routeRequestSchema': this.routeRequestSchema};
	}
} // End of class

module.exports.ValidationClass = ValidationClass;
