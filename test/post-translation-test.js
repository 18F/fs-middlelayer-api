/* eslint no-undefined: 0 */
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

const SUDSconnection =  require('../src/controllers/sudsconnection');
const populateValues = require('../src/controllers/sudsconnection/populateFields.js').populateValues;

//*******************************************************************
describe('Tests that the following object field objects were populated properly', function(){

	it('should set a fromIntake:false default field as default .. i.e. phoneType = BUSINESS', function(){
		
	});

    it('should concatentate values in a madeOfField', function(){
		
	});

	it('correctly build a contID for an individual with a short name', function(){
	
	});

    it('correctly build a contID for an individual with a long name', function(){
		
	});

    it('correctly build a contID for an organization', function(){

	});

	it('populate a toplevel field fromIntake:true', function(){

    });
    
    it('populate a nested field fromIntake:true', function () {

    });

    it('rename an intake field that has a different "sudsField" name', function () {

    });
});

//*******************************************************************
//
//*******************************************************************
describe('Tests the populateValues function', function(){

	it('should return empty given empty parameters', function(){
        expect(populateValues({}, {}, {}, true))
            .to.eql({});
	});

    const fieldsByEndpointSample = {
        '/contact/person': {
            'applicantInfo.firstName': {
                'sudsField': 'firstName',
                'default':'',
                'fromIntake':true,
                'sudsEndpoint':['/contact/person'],
                'type': 'string'
            },
            'applicantInfo.lastName': {
                'sudsField': 'lastName',
                'default':'',
                'fromIntake':true,
                'sudsEndpoint':['/contact/person'],
                'type': 'string'
            }
        }
    };

	it('should have an empty value for /contact/person.firstName in the output if given no intake input', function(){
        const expected = {
            '/contact/person': {
                'firstName': '',
                'lastName': ''
                }
        };
        expect(populateValues(fieldsByEndpointSample, {}, {}, true))
            .to.eql(expected);
	});

	it('should have the value of applicantInfo.firstName in the output if given input', function(){
        const intakeRequestSample = {
            'type': 'noncommercial',
            'noncommercialFields': {},
            'applicantInfo': {
                'firstName': 'John',
                'lastName': 'Doe'
            }
        };
        const expected = {
            '/contact/person': {
                'firstName': 'John',
                'lastName': 'Doe',
                }
        };
        expect(populateValues(fieldsByEndpointSample, intakeRequestSample, {}, true))
            .to.eql(expected);
	});

	it('should have the value of applicantInfo.firstName and empty applicantInfo.lastName in the output if given appropriate input', function(){
        const intakeRequestSample = {
            'type': 'noncommercial',
            'noncommercialFields': {},
            'applicantInfo': {
                'firstName': 'John',
            }
        };
        const expected = {
            '/contact/person': {
                'firstName': 'John',
                'lastName': ''
            }
        };
        expect(populateValues(fieldsByEndpointSample, intakeRequestSample, {}, true))
            .to.eql(expected);
	});

});

//*******************************************************************
