/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

const chai = require('chai');
const expect = chai.expect;

const errorMessages = require('../src/controllers/errors/validation-messages.js');

const factory = require('unionized');
const errorMessageFactory = factory.factory({'field': null, 'errorType': null, 'expectedFieldType': null, 'enumMessage': null, 'dependency':null});
const errorFactory = factory.factory({'errorArray':factory.array(errorMessageFactory)});

//*******************************************************************

function errorMessageValidatorHelper(errorFactoryOjbect){
	const errorMessage = errorMessages.generateErrorMessage(errorFactoryOjbect.errorArray[0]);
	return errorMessage;
}

describe('Build error messages: ', function(){

	it('should return \'First name is a required field.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'applicantInfo.firstName',
				'errorArray[0].errorType': 'missing'
			}));
		expect(actual)
		.to.be.equal('Applicant Info/First Name is a required field.');
	
	});

	it('should return \'First Name is a required field. Last Name is a required field.\'', function(){
		const messages = [];
		const errorFactoryOjbect = errorFactory.create(
			{
				'errorArray[]': 2,
				'errorArray[0].field': 'applicantInfo.firstName',
				'errorArray[0].errorType': 'missing',
				'errorArray[1].field': 'applicantInfo.lastName',
				'errorArray[1].errorType': 'missing'
			}
		);
		messages.push(errorMessages.generateErrorMessage(errorFactoryOjbect.errorArray[0]));
		messages.push(errorMessages.generateErrorMessage(errorFactoryOjbect.errorArray[1]));
		const actual = `${messages[0]} ${messages[1]}`;
		expect(actual)
		.to.be.equal('Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field.');
	
	});

	it('should return \'First Name is expected to be of type \'string\'.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'applicantInfo.firstName',
				'errorArray[0].errorType': 'type',
				'errorArray[0].expectedFieldType': 'string'
			}));
		expect(actual)
		.to.be.equal('Applicant Info/First Name is expected to be type \'string\'.');
	
	});

	it('should return \'Mailing Zip must be 5 or 9 digits.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'applicantInfo.mailingZIP',
				'errorArray[0].errorType': 'format'
			}));
		expect(actual)
		.to.be.equal('Applicant Info/Mailing Zip must be 5 or 9 digits.');
	
	});

	it('should return \'First Name with some enum message.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'applicantInfo.firstName',
				'errorArray[0].errorType': 'enum',
				'errorArray[0].message': 'with some enum message'
			}));
		expect(actual)
		.to.be.equal('Applicant Info/First Name with some enum message.');
	
	});

	it('should return \'Having Applicant Info/First Name requires that Applicant Info/Last Name be provided.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'applicantInfo.firstName',
				'errorArray[0].errorType': 'dependencies',
				'errorArray[0].dependency': 'applicantInfo.lastName'
			}));
		expect(actual)
		.to.be.equal('Having Applicant Info/First Name requires that Applicant Info/Last Name be provided.');
	
	});

	it('should return \'Either Temp Outfitter Fields/Advertising URL or Temp Outfitter Fields/Advertising Description is a required field.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].errorType': 'anyOf',
				'errorArray[0].anyOfFields': [
					'tempOutfitterFields.advertisingURL',
					'tempOutfitterFields.advertisingDescription'
				]
			}));
		expect(actual)
		.to.be.equal('Either Temp Outfitter Fields/Advertising URL or Temp Outfitter Fields/Advertising Description is a required field.');
	
	});

	it('should return \'Applicant Info/First Name is too long, must be 255 chracters or shorter\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'applicantInfo.firstName',
				'errorArray[0].errorType': 'length',
				'errorArray[0].expectedFieldType': 255
			}));
		expect(actual)
		.to.be.equal('Applicant Info/First Name is too long, must be 255 chracters or shorter');
	
	});
	
	it('should return \'Insurance Certificate cannot be larger than 10 MB.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'insuranceCertificate',
				'errorArray[0].errorType': 'invalidSizeLarge',
				'errorArray[0].expectedFieldType': '10'
			}));
		expect(actual)
		.to.be.equal('Insurance Certificate cannot be larger than 10 MB.');
	
	});

	it('should return \'Insurance Certificate cannot be an empty file.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'insuranceCertificate',
				'errorArray[0].errorType': 'invalidSizeSmall',
				'errorArray[0].expectedFieldType': '0'
			}));
		expect(actual)
		.to.be.equal('Insurance Certificate cannot be an empty file.');
	
	});

	it('should return \'Insurance Certificate must be one of the following mime types: application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, text/rtf, application/pdf.\'', function(){
		const actual = errorMessageValidatorHelper(errorFactory.create(
			{
				'errorArray[]': 1,
				'errorArray[0].field': 'insuranceCertificate',
				'errorArray[0].errorType': 'invalidMime',
				'errorArray[0].expectedFieldType': [
					'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					'application/msword',
					'text/rtf',
					'application/pdf'
				]
			}));
		expect(actual)
		.to.be.equal('Insurance Certificate must be one of the following mime types: application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword, text/rtf, application/pdf.');
	
	});

	it('makeAnyOfMessage should return expected output', function () {
		expect(errorMessages.makeAnyOfMessage(['field1', 'field2']))
			.to.be.equal('Field1 or Field2');
	});

	it('makePathReadable should return expected output', function () {
		expect(errorMessages.makePathReadable('error.field'))
			.to.be.equal('Error/Field');
	});

	it('makeFieldReadable should return expected output', function () {
		expect(errorMessages.makeFieldReadable('firstName'))
			.to.be.equal('First Name');
	});

});

//*******************************************************************
