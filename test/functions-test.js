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

	it('combinePropArgument should return instance and property', function(){
		expect( validationJs.functions.combinePropArgument('abc', 'xyz') )
		.to.be.equal('abc.xyz');
	});

	it('combinePropArgument should return property when instance is blank', function(){
		expect( validationJs.functions.combinePropArgument('', 'xyz') )
		.to.be.equal('xyz');
	});

	it('makeErrorObj should return output object with supplied elements', function(){
		expect( validationJs.functions.makeErrorObj('field', 'errorType', 'expectedFieldType', 'enumMessage', 'dependency', 'anyOfFields') )
		.to.eql({ field: 'field', errorType:'errorType', expectedFieldType:'expectedFieldType', enumMessage:'enumMessage', dependency:'dependency', anyOfFields:'anyOfFields'});
	});

	it('makeErrorObj should return output object with supplied elements (not all)', function(){
		expect( validationJs.functions.makeErrorObj('field', 'errorType', 'expectedFieldType', null, 'dependency', 'anyOfFields') )
		.to.eql({ field: 'field', errorType:'errorType', expectedFieldType:'expectedFieldType', dependency:'dependency', anyOfFields:'anyOfFields'});
	});

	it('concatErrors should return expected output', function(){
		expect( validationJs.functions.concatErrors(['a','b']) )
		.to.be.equal('a b');
	});

	it('makePathReadable should return expected output', function(){
		expect( validationJs.functions.makePathReadable('error.field') )
		.to.be.equal('Error/Field');
	});

	it('makeAnyOfMessage should return expected output', function(){
		expect( validationJs.functions.makeAnyOfMessage(['field1', 'field2']) )
		.to.be.equal('Field1 or Field2');
	});

	it('makeFieldReadable should return expected output', function(){
		expect( validationJs.functions.makeFieldReadable('firstName') )
		.to.be.equal('First Name');
	});
	

});

//*******************************************************************
