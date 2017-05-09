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

const specialUses = {};

specialUses.validate = require('../src/controllers/validation.js');

const factory = require('unionized');
const errorMessageFactory = factory.factory({'field': null, 'errorType': null, 'expectedFieldType': null, 'enumMessage': null, 'dependency':null});
const errorFactory = factory.factory({'errorArray':factory.array(errorMessageFactory)});

//*******************************************************************

describe('API Controllers: build error message', function(){

	it('should return \'First name is a required field.\'', function(){
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1, 
				'errorArray[0].field':'applicantInfo.firstName',
				'errorArray[0].errorType':'missing'
			})) 
		)
		.to.be.equal('Applicant Info/First Name is a required field.');
	
	});

	it('should return \'First Name is a required field. Last Name is a required field.\'', function(){
	
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':2,
				'errorArray[0].field':'applicantInfo.firstName',
				'errorArray[0].errorType':'missing',
				'errorArray[1].field':'applicantInfo.lastName',
				'errorArray[1].errorType':'missing'
			}))
		)
		.to.be.equal('Applicant Info/First Name is a required field. Applicant Info/Last Name is a required field.');
	
	});

	it('should return \'First Name is expected to be of type \'string\'.\'', function(){
	
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1,
				'errorArray[0].field':'applicantInfo.firstName',
				'errorArray[0].errorType':'type',
				'errorArray[0].expectedFieldType':'string'
			}))
		)
		.to.be.equal('Applicant Info/First Name is expected to be type \'string\'.');
	
	});

	it('should return \'Mailing Zip must be 5 or 9 digits.\'', function(){
	
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1,
				'errorArray[0].field':'applicantInfo.mailingZIP',
				'errorArray[0].errorType':'format'
			}))
		)
		.to.be.equal('Applicant Info/Mailing Zip must be 5 or 9 digits.');
	
	});

	it('should return \'First Name with some enum message.\'', function(){
	
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1,
				'errorArray[0].field':'applicantInfo.firstName',
				'errorArray[0].errorType':'enum',
				'errorArray[0].enumMessage':'with some enum message'
			}))
		)
		.to.be.equal('Applicant Info/First Name with some enum message.');
	
	});

	it('should return \'Having Applicant Info/First Name requires that Applicant Info/Last Name be provided.\'', function(){
	
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1,
				'errorArray[0].field':'applicantInfo.firstName',
				'errorArray[0].errorType':'dependencies',
				'errorArray[0].dependency':'applicantInfo.lastName'
			}))
		)
		.to.be.equal('Having Applicant Info/First Name requires that Applicant Info/Last Name be provided.');
	
	});

	it('should return \'Either Temp Outfitter Fields/Advertising URL or Temp Outfitter Fields/Advertising Description is a required field.\'', function(){
	
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1,
				'errorArray[0].errorType':'anyOf',
				'errorArray[0].anyOfFields':[
					'tempOutfitterFields.advertisingURL',
					'tempOutfitterFields.advertisingDescription'
				]
			}))
		)
		.to.be.equal('Either Temp Outfitter Fields/Advertising URL or Temp Outfitter Fields/Advertising Description is a required field.');
	
	});

	it('should return \'Applicant Info/First Name is too long, must be 255 chracters or shorter\'', function(){
	
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1,
				'errorArray[0].field':'applicantInfo.firstName',
				'errorArray[0].errorType':'length',
				'errorArray[0].expectedFieldType':255
			}))
		)
		.to.be.equal('Applicant Info/First Name is too long, must be 255 chracters or shorter');
	
	});
	
	it('should return \'Insurance Certificate cannot be larger than 10 MB.\'', function(){
	
		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1,
				'errorArray[0].field':'insuranceCertificate',
				'errorArray[0].errorType':'invalidSizeLarge',
				'errorArray[0].expectedFieldType':'10'
			}))
		)
		.to.be.equal('Insurance Certificate cannot be larger than 10 MB.');
	
	});

	it('should return \'Insurance Certificate cannot be an empty file.\'', function(){

		expect( specialUses.validate.generateErrorMesage(errorFactory.create(
			{
				'errorArray[]':1,
				'errorArray[0].field':'insuranceCertificate',
				'errorArray[0].errorType':'invalidSizeSmall',
				'errorArray[0].expectedFieldType':'0'
			}))
		)
		.to.be.equal('Insurance Certificate cannot be an empty file.');
	
	});
});

//*******************************************************************
