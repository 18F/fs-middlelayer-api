/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

require('dotenv').config();

const chai = require('chai');
const expect = chai.expect;

const validationJs = {};
validationJs.functions =  require('../src/controllers/validation.js');

//*******************************************************************

describe('Function Tests: validation.js ', function(){

	it('digitCheck should return true with a valid input (123)', function(){
		expect( validationJs.functions.digitCheck(123, 3) )
		.to.be.equal(true);
	});

	it('digitCheck should return false with an invalid input (1234)', function(){
		expect( validationJs.functions.digitCheck(1234, 3) )
		.to.be.equal(false);
	});

	it('areaCodeFormat should return true with a valid input (123)', function(){
		expect( validationJs.functions.areaCodeFormat(123) )
		.to.be.equal(true);
	});

	it('areaCodeFormat should return false with an invalid input (1234)', function(){
		expect( validationJs.functions.areaCodeFormat(1234) )
		.to.be.equal(false);
	});

	it('phoneNumberFormat should return true with a valid input (1234567)', function(){
		expect( validationJs.functions.phoneNumberFormat(1234567) )
		.to.be.equal(true);
	});

	it('phoneNumberFormat should return false with an invalid input (1234)', function(){
		expect( validationJs.functions.phoneNumberFormat(1234) )
		.to.be.equal(false);
	});

	it('removeInstance should return just the property with an input (abc.xyz)', function(){
		expect( validationJs.functions.removeInstance('abc.xyz') )
		.to.be.equal('xyz');
	});

});

//*******************************************************************
