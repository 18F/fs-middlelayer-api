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
const include = require('include')(__dirname);

const chai = require('chai');
const deref = require('deref');
const Deref = deref()
const expect = chai.expect;
const factory = require('unionized');
const util = require('util');

const prepareSudsPost = require('../src/controllers/sudsconnection/post.js').prepareSudsPost;
const populateValues = require('../src/controllers/sudsconnection/populateFields.js').populateValues;
const generateAutoPopulatedField = require('../src/controllers/sudsconnection/populateFields.js').generateAutoPopulatedField;

const tempOutfitterInput = include('test/data/testInputTempOutfitters.json');
const translateSchema = include('./src/controllers/translate.json');
const outfittersSchema = Deref(translateSchema.tempOutfitterApplication, [translateSchema], true);

const tempOutfitterFactory = factory.factory(tempOutfitterInput);
//*******************************************************************
//

/** Takes fields to be stored, creates post objects and populated with user input
 * @param  {Object} validationSchema - validation schema for route requested
 * @param  {Object} body - user input
 * @param  {Boolean} person - whether application is for individual(true) or organization (false)
 * @return {Object} - A nested object of the individual objects that will be sent to SUDS by endpoint
 */
/*
function prepareSudsPost(validationSchema, body, person){
	const fieldsToPost = [];
	db.getFieldsToStore(validationSchema, fieldsToPost, '', 'SUDS');
	const fieldsToSendByEndpoint = assignFieldsToEndpoints(fieldsToPost);
	const autoPopulateFields = populate.findAutoPopulatedFieldsFromSchema(fieldsToPost);
	const populatedPostObject = populate.populateValues(fieldsToSendByEndpoint, body, autoPopulateFields, person);
	return populatedPostObject;
}
*/

function clog (stuff) {
    console.log(util.inspect(stuff, { depth: 8 }));
}


describe('Tests that the following object field objects were populated properly', function(){

	xit('should set a fromIntake:false default field as default .. i.e. phoneType = BUSINESS', function(){
		
	});

    xit('should concatentate values in a madeOfField', function(){
		
	});

	it('correctly build a contID for an individual with a short name', function(){
        let body = tempOutfitterFactory.create();
        let schema = outfittersSchema;
        const person = true;
        const expected = { '/application':
        { securityId: '',
          managingID: '',
          adminOrg: '',
          ePermitID: '',
          acres: 0,
          contCN: '',
          activityDescription: 'Sample Activity',
          formName: 'FS-2700-4I' },
       '/contact/address':
        { securityId: '',
          emailAddress: 'test@email.com',
          mailingAddress: '1234 Main St',
          mailingAddress2: '',
          mailingCity: 'Washington',
          mailingState: 'DC',
          mailingZIP: '12345' },
       '/contact/phone':
        { securityId: '',
          contCN: '',
          areaCode: 0,
          number: 0,
          extension: '',
          phoneType: '' },
       '/contact/person': { contCN: '', firstName: 'John', lastName: 'Doe' },
       '/contact/organization':
        { organizationName: 'ABC Company',
          undefined: 'Limited Liability Company (LLC)' } }
        let result = prepareSudsPost(schema, body, person);
        console.log("result", result['/contact/person']);
        expect(result['/contact/person']).to.have.keys(['contId', 'firstName', 'lastName']);
        expect(result['/contact/person'].contId).to.eql('DOEJOHN');
	});

    xit('correctly build a contID for an individual with a long name', function(){
		
	});

    xit('correctly build a contID for an organization', function(){

	});

	xit('populate a toplevel field fromIntake:true', function(){

    });
    
    xit('populate a nested field fromIntake:true', function () {

    });

    xit('rename an intake field that has a different "sudsField" name', function () {

    });
});


/**
 * Handle autoPolutated values based on what type of field
 * @param {Object} field - field to evaluated
 * @param {Boolean} person - whether the input is for an individual or an organization?
 * @param {Array} fieldMakeUp - array of the subfields or strings that comprise the field
 * @return {String} fieldValue - the string of the fieldValue
 */
/*
function generateAutoPopulatedField(field, person, fieldMakeUp) {
	let fieldValue;
	switch (field.madeOf.function) {
	case 'concat':
		fieldValue = concat(fieldMakeUp);
		break;
	case 'contId':
		if (person) {
			if (fieldMakeUp.length > 3) {
				fieldMakeUp.pop();
			}
			fieldValue = contId(fieldMakeUp);
		}
		else {
			const toUse = [];
			toUse.push(fieldMakeUp.pop());
			fieldValue = contId(toUse);
		}
		break;
	case 'ePermitId':
		fieldValue = ePermitId(fieldMakeUp);
		break;
	}
	return fieldValue;
}
*/

//*******************************************************************
xdescribe('Tests the generateAutoPopulatedField function', function(){
    it('should return appropriate contId', function () {
        const field = {
            'sudsField': 'contId',
            'default':'',
            'fromIntake': false,
            'madeOf': {
                'function': 'contId',
                'fields': ['lastName', 'firstName'],
            },
            'sudsEndpoint':['/contact/person'],
            'type': 'string'
        };
        const person = true;
        const fieldMakeUp = ['Doe', 'John'];
        const result = generateAutoPopulatedField(field, person, fieldMakeUp);
        console.log("HI");
        console.log(result);

    });

});

//*******************************************************************
//
//*******************************************************************
xdescribe('Tests the populateValues function', function(){

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
