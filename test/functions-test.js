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

const validationJs =  require('../src/controllers/validation.js');
const utility = require('../src/controllers/utility.js');

//*******************************************************************

describe('Function Tests: validation.js ', function(){

	it('removeInstance should return just the property with an input (abc.xyz)', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect( Validator.removeInstance('abc.xyz') )
		.to.be.equal('xyz');
	});

	it('removeInstance should return an empty string with an input (xyz)', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect( Validator.removeInstance('xyz') )
		.to.be.equal('');
	});

	it('combinePropArgument should return instance and property', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.combinePropArgument('abc', 'xyz') )
		.to.be.equal('abc.xyz');
	});

	it('combinePropArgument should return property when instance is blank', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.combinePropArgument('', 'xyz') )
		.to.be.equal('xyz');
	});

	it('makeErrorObj should return output object with supplied elements', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.makeErrorObject('field', 'errorType', 'expectedFieldType', 'enumMessage', 'dependency', 'anyOfFields') )
		.to.eql({ field: 'field', errorType:'errorType', expectedFieldType:'expectedFieldType', enumMessage:'enumMessage', dependency:'dependency', anyOfFields:'anyOfFields'});
	});

	it('makeErrorObj should return output object with supplied elements (not all)', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.makeErrorObject('field', 'errorType', 'expectedFieldType', null, 'dependency', 'anyOfFields') )
		.to.eql({ field: 'field', errorType:'errorType', expectedFieldType:'expectedFieldType', dependency:'dependency', anyOfFields:'anyOfFields'});
	});

	it('concatErrors should return expected output', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.concatErrors(['a', 'b']) )
		.to.be.equal('a b');
	});

	it('makePathReadable should return expected output', function(){
		expect(utility.makePathReadable('error.field') )
		.to.be.equal('Error/Field');
	});

	it('makeAnyOfMessage should return expected output', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.makeAnyOfMessage(['field1', 'field2']) )
		.to.be.equal('Field1 or Field2');
	});

	it('makeFieldReadable should return expected output', function(){
		expect(utility.makeFieldReadable('firstName') )
		.to.be.equal('First Name');
	});

});

//*******************************************************************
