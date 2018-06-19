/* eslint no-undefined: 0 */
/*

  ___ ___	   ___			   _ _	   _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_	/_\ | _ \_ _|
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
const Deref = deref();
const expect = chai.expect;
const factory = require('unionized');
const util = require('util');

const db = require('../src/controllers/db.js');
const prepareSudsPost = require('../src/controllers/sudsconnection/post.js').prepareSudsPost;
const populateValues = require('../src/controllers/sudsconnection/populateFields.js').populateValues;
const generateAutoPopulatedField = require('../src/controllers/sudsconnection/populateFields.js').generateAutoPopulatedField;

const tempOutfitterInput = include('test/data/testInputTempOutfitters.json');
const noncommercialInput = include('test/data/testInputNoncommercial.json');
const translateSchema = include('./src/controllers/translate.json');
const outfittersSchema = Deref(translateSchema.tempOutfitterApplication, [translateSchema], true);
const noncommercialSchema = Deref(translateSchema.noncommercialApplication, [translateSchema], true);

const tempOutfitterFactory = factory.factory(tempOutfitterInput);
const noncommercialFactory = factory.factory(noncommercialInput);
//*******************************************************************
//

const expected = {
	'/application': {
		securityId:'',
		managingID:'',
		adminOrg:'',
		ePermitID:'',
		acres:0,
		contCN:'',
		activityDescription:'SampleActivity',
		formName:'FS-2700-4I'
	},
	'/contact/address': {
		securityId:'',
		emailAddress:'test@email.com',
		mailingAddress:'1234MainSt',
		mailingAddress2:'',
		mailingCity:'Washington',
		mailingState:'DC',
		mailingZIP:'12345'
	},
	'/contact/phone': {
		securityId:'',
		contCN:'',
		areaCode:0,
		number:0,
		extension:'',
		phoneType:''
	},
	'/contact/person': {
		contCN:'',
		firstName:'John',
		lastName:'Doe'
	},
	'/contact/organization': {
		organizationName:'ABCCompany',
		undefined:'LimitedLiabilityCompany(LLC)'
	}
};

/** Convenience wrapper around prepareSudsPost
 * @param  {Object} body - user input
 * @param  {Object} options for what gets passed to prepareSudsPost. Keys are:
 *				  * {Object} validationSchema - validation schema for route requested, defaults to outfittersSchema
 *				  * {Boolean} person - whether application is for individual(true) or organization (false), defaults to true
 * @return {Object} - A nested object of the individual objects that will be sent to SUDS by endpoint
 */
function wrapSudsPrep(body, validationSchema, person) {
	let usingSchema = outfittersSchema;
	if (Object.keys(validationSchema).length > 0){
		usingSchema = validationSchema;
	}
	console.log(validationSchema);
	return prepareSudsPost(usingSchema, body, person);
}
 
function clog (stuff) {  // eslint-disable-line
	console.log(util.inspect(stuff, { depth: 8 }));
}

describe('Tests that the following object field objects were populated properly', function(){

	it('should set a fromIntake:false default field as default .. i.e. phoneType = BUSINESS', function(){
		const body = tempOutfitterFactory.create({
			'applicantInfo': {
				'dayPhone': {
					'phoneType': 'whatever'
				}
			}
		});
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/contact/phone'].phoneNumberType).to.eql('BUSINESS');

	});

	it('should set the fields in /contact/phone correctly', function(){
		// TODO: enable this test when we're sure what contCn in /contact/phone should be.
		const body = tempOutfitterFactory.create({
			'region': '23',
			'forest': '17',
			'applicantInfo': {
				'dayPhone': {
					'areaCode': '555',
					'number': '1234567',
					'extension': '0',
					'phoneType': 'BUSINESS'
				}
			}
		});
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/contact/phone']).to.eql({
			'areaCode': '555',
            'contCn': '',
			'phoneNumber': '1234567',
			'extension': '0',
			'phoneNumberType': 'BUSINESS',
			'securityId': '2317'
		});

	});

	it('should concatentate values in a madeOfField', function(){
		const body = tempOutfitterFactory.create({
			'region': '23',
			'forest': '17'
		});
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/contact/phone'].securityId).to.eql('2317');
		expect(result['/contact/address'].securityId).to.eql('2317');
		expect(result['/application'].securityId).to.eql('2317');
		
	});

	it('correctly builds a contID for an individual with a short name', function(){
		const body = tempOutfitterFactory.create({
			'applicantInfo': {
				'firstName': 'John',
				'lastName': 'Doe'
			}
		});
		expect(expected);
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/contact/person']).to.eql({
			'contId': 'DOE, JOHN',
			'firstName': 'John',
			'lastName': 'Doe'
		});
	});

	it('correctly builds a contID for an individual with an org name present', function(){
		const body = tempOutfitterFactory.create({
			'applicantInfo': {
				'firstName': 'smoouch',
				'lastName': 'mcgee',
				'organizationName': 'Sonicals fires time squad'
			}
		});
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/contact/person']).to.eql({
			'contId': 'MCGEE, SMOOUCH',
			'firstName': 'smoouch',
			'lastName': 'mcgee'
		});
	});

	it('correctly builds a contID for an organization', function(){
		// TODO: Enable this test when we verify what the contId for an organization should be; code and schema make it look like it might be either the same as for an individual (which is a little odd) or the organization type (which would be very odd).
		const body = tempOutfitterFactory.create({
			'applicantInfo': {
				'firstName': 'John',
				'lastName': 'Doe',
				'organizationName': 'RayMiFaSoLaTiDoe',
				'orgType': 'Association'
			}
		});
		clog(body);
		expect(expected);
		const result = wrapSudsPrep(body, {}, false);
		expect(result['/contact/organization'].contId).to.eql('RAYMIFASOLATIDOE');

	});

	it('populates a toplevel field fromIntake:true', function(){
		// TODO: Verify that this means top-level in one of the output keys, and not top-level in the input.
        // If it's top-level in the input, what top-level fields in the input are present in the output?
		const descr = 'Five friends go to a cabin in the woods. Bad things happen.';
		const body = tempOutfitterFactory.create({
			'tempOutfitterFields': {
				'activityDescription': descr
			}
		});
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/application'].purpose).to.eql(descr);
	});
	
	xit('populate a nested field fromIntake:true', function () {
        // TODO: Depends on verified details for prior test.
	});

	it('rename an intake field that has a different "sudsField" name', function () {
		const descr = 'Rename me rename me rename me.';
		const body = tempOutfitterFactory.create({
			'tempOutfitterFields': {
				'activityDescription': descr
			}
		});
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/application'].purpose).to.eql(descr);

	});

	it('add line breaks to a field with "linebreak" in the body ', function(){
		const body = noncommercialFactory.create();
		console.log(body);

		const result = wrapSudsPrep(body, noncommercialSchema, false);
		const expected = 'Activity Description:  noncommercialFields.activityDescription. \n Location Description:  noncommercialFields.locationDescription. \n Start Date Time:  noncommercialFields.startDateTime. \n End Date Time:  noncommercialFields.endDateTime. \n Number Participants:  noncommercialFields.numberParticipants. \n Number Spectators:  noncommercialFields.numberSpectators.';
		expect(result['/application'].purpose).to.eql(expected);
	});
});

/** Convenience wrapper around db.getFieldsToStore
 * @param  {Object} schema - the schema defining what fields are relevant
 * @return {Object} - the fields to be posted.
 */
function wrapStoreFields(schema) {
	const fieldsToPost = [];
	db.getFieldsToStore(schema, fieldsToPost, '', 'SUDS');
	return fieldsToPost;
}

describe('Tests for db.getFieldsToStore', function(){
	it('does something', function () {
		const result = wrapStoreFields(outfittersSchema);
		expect(result.length).to.eql(28);
	});

	it('works on a basic schema with `properties`', function () {
		const result = wrapStoreFields({
            'properties':{
                'firstName': {
                    'sudsField':'firstName',
                    'default':'',
                    'fromIntake':true,
                    'maxLength':255,
                    'sudsEndpoint':['/contact/person'],
                    'type': 'string'
                }
            }
        });
		expect(result.length).to.eql(1);
		expect(result[0].firstName.maxLength).to.eql(255);
	});

	it('works on oneOf', function () {
		const result = wrapStoreFields({
            'oneOf': [{
                'firstName': {
                    'sudsField':'firstName',
                    'default':'',
                    'fromIntake':true,
                    'maxLength':255,
                    'sudsEndpoint':['/contact/person'],
                    'type': 'string'
                }
            }]
        });
		expect(result.length).to.eql(1);
		expect(result[0].firstName.maxLength).to.eql(255);
	});

	it('works on allOf', function () {
        // TODO: Why do oneOf and allOf do the same thing?
		const result = wrapStoreFields({
            'allOf': [
                {
                    'firstName': {
                        'sudsField':'firstName',
                        'default':'',
                        'fromIntake':true,
                        'maxLength':255,
                        'sudsEndpoint':['/contact/person'],
                        'type': 'string'
                    }
                },
                {
                    'lastName': {
                        'sudsField':'lastName',
                        'default':'',
                        'fromIntake':true,
                        'maxLength':255,
                        'sudsEndpoint':['/contact/person'],
                        'type': 'string'
                    }
                }
            ]
        });
		expect(result.length).to.eql(2);
		expect(result[0].firstName.maxLength).to.eql(255);
	});

	it('works on a basic schema with `properties`', function () {
		const result = wrapStoreFields({
            'properties':{
                'firstName': {
                    'sudsField':'firstName',
                    'default':'',
                    'fromIntake':true,
                    'maxLength':255,
                    'sudsEndpoint':['/contact/person'],
                    'type': 'string'
                },
                'lastName': {
                    'sudsField':'lastName',
                    'default':'',
                    'fromIntake':true,
                    'maxLength':255,
                    'sudsEndpoint':['/contact/person'],
                    'type': 'string'
                }
            }
        });
		expect(result.length).to.eql(2);
		expect(result[0].firstName.maxLength).to.eql(255);
		expect(result[1].lastName.maxLength).to.eql(255);
	});

	it('works on a schema without the above special keys', function () {
		const result = wrapStoreFields({
            'firstName': {
                'sudsField':'firstName',
                'default':'',
                'fromIntake':true,
                'maxLength':255,
                'sudsEndpoint':['/contact/person'],
                'type': 'string'
            },
            'lastName': {
                'sudsField':'lastName',
                'default':'',
                'fromIntake':true,
                'maxLength':255,
                'sudsEndpoint':['/contact/person'],
                'type': 'string'
            }
        });
		expect(result.length).to.eql(2);
		expect(result[0].firstName.maxLength).to.eql(255);
		expect(result[1].lastName.maxLength).to.eql(255);
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
describe('Tests the generateAutoPopulatedField function', function(){
	it('should return appropriate contId', function () {
		const field = {
			'sudsField': 'contId',
			'default':'',
			'fromIntake': false,
			'madeOf': {
				'function': 'contId',
				'fields': ['lastName', 'firstName']
			},
			'sudsEndpoint':['/contact/person'],
			'type': 'string'
		};
		const person = true;
		const fieldMakeUp = ['Doe', 'John'];
		const result = generateAutoPopulatedField(field, person, fieldMakeUp);
		console.log('HI');
		console.log(result);

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
		expect(populateValues(fieldsByEndpointSample, {}, [], true))
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
				'lastName': 'Doe'
			}
		};
		expect(populateValues(fieldsByEndpointSample, intakeRequestSample, [], true))
			.to.eql(expected);
	});

	it('should have the value of applicantInfo.firstName and empty applicantInfo.lastName in the output if given appropriate input', function(){
		const intakeRequestSample = {
			'type': 'noncommercial',
			'noncommercialFields': {},
			'applicantInfo': {
				'firstName': 'John'
			}
		};
		const expected = {
			'/contact/person': {
				'firstName': 'John',
				'lastName': ''
			}
		};
		expect(populateValues(fieldsByEndpointSample, intakeRequestSample, [], true))
			.to.eql(expected);
	});

});

//*******************************************************************
