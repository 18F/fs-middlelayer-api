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

	it('makeErrorObject should return output object with supplied elements', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.makeErrorObject('field', 'errorType', 'expectedFieldType', 'enumMessage', 'dependency', 'anyOfFields') )
		.to.eql({
			field: 'field',
			errorType:'errorType',
			expectedFieldType:'expectedFieldType',
			enumMessage:'enumMessage',
			dependency:'dependency',
			anyOfFields:'anyOfFields',
			message: undefined
		});
	});

	it('makeErrorObj should return output object with supplied elements (not all)', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.makeErrorObject('field', 'errorType', 'expectedFieldType', null, 'dependency', 'anyOfFields') )
			.to.eql({
				field: 'field',
				errorType: 'errorType',
				expectedFieldType: 'expectedFieldType',
				dependency: 'dependency',
				anyOfFields: 'anyOfFields',
				message: undefined
			});
	});

	it('concatErrors should return expected output', function(){
		const Validator = new validationJs.ValidationClass('', '');
		expect(Validator.concatErrors(['a', 'b']) )
		.to.be.equal('a b');
	});

});

//*******************************************************************
