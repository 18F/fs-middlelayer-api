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

specialUses.validate = require('../controllers/permits/special-uses/validate.js');
specialUses.buildErrorMessage = require('../controllers/permits/special-uses/utility.js');

//*******************************************************************

describe('API Controllers: build error message', function(){

	it('should return \'First name is a required field.\'', function(){
    
		const errors = [{'field':'firstName', 'errorType':'missing'}];
		expect( specialUses.buildErrorMessage.buildErrorMessage(errors) ).to.be.equal('First name is a required field.');
    
	});

	it('should return \'First name is a required field. Last name is a required field.\'', function(){
    
		const errors = [{'field':'firstName', 'errorType':'missing'}, {'field':'lastName', 'type':'missing'}];
		expect( specialUses.buildErrorMessage.buildErrorMessage(errors) ).to.be.equal('First name is a required field. Last name is a required field.');
    
	});

	it('should return \'First name is expected to be of type \'string\'.\'', function(){
    
		const errors = [{'field':'firstName', 'errorType':'type', 'expectedType': 'string'}];
		expect( specialUses.buildErrorMessage.buildErrorMessage(errors) ).to.be.equal('First name is expected to be of type \'string\'');
    
	});

	it('should return \'Mailing zip must be 5 or 9 digits.\'', function(){
    
		const errors = [{'field':'applicantInfo.mailingZIP', 'errorType':'format'}];
		expect( specialUses.buildErrorMessage.buildErrorMessage(errors) ).to.be.equal('Mailing zip must be 5 or 9 digits.');
    
	});

	it('should return \'First name with some enum message.\'', function(){
    
		const errors = [{'field':'firstName', 'errorType':'enum', 'expectedType': null, 'enumMessage':'with some enum message.'}];
		expect( specialUses.buildErrorMessage.buildErrorMessage(errors) ).to.be.equal('Mailing zip must be 5 or 9 digits.');
    
	});
    
});

//*******************************************************************
