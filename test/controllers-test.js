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

specialUses.validate = require('../controllers/validation.js');

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
    
});

//*******************************************************************
