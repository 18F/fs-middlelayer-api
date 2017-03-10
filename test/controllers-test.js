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

	it('should return \'firstName is a required field!\'', function(){
    
		const errors = {'missingArray': ['firstName']};
		expect( specialUses.buildErrorMessage.buildErrorMessage(errors) ).to.be.equal('firstName is a required field!');
    
	});

	it('should return \'firstName and lastName are required fields!\'', function(){
    
		const errors = {'missingArray': ['firstName', 'lastName']};
		expect( specialUses.buildErrorMessage.buildErrorMessage(errors) ).to.be.equal('firstName and lastName are required fields!');
    
	});
    
});

//*******************************************************************
