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
const Deref = deref();
const expect = chai.expect;
const factory = require('unionized');
const server = include('src/index.js'); // eslint-disable-line
// Linting on above line disabled because without it you can't run mocha on this test file on its own, even though the variable isn't used in this file.
const util = require('util');

const auth = require('../src/controllers/sudsconnection/auth.js');
const db = require('../src/controllers/db.js');
const prepareSudsPost = require('../src/controllers/sudsconnection/post.js').prepareSudsPost;
const setContactGETOptions = require('../src/controllers/sudsconnection/post.js').setContactGETOptions;
const populateValues = require('../src/controllers/sudsconnection/populateFields.js').populateValues;

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
		const expected = [
			'ID on Open Forest platform: 90.',
			'Five friends go to a cabin in the woods. Bad things happen.'
		].join(' \n');
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/application'].purpose).to.eql(expected);
	});
	
	it('populate a nested field fromIntake:true', function () {
		const body = tempOutfitterFactory.create({});
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/contact/phone'].areaCode).to.eql('202');
	});

	it('rename an intake field that has a different "sudsField" name', function () {
		const descr = 'Rename me rename me rename me.';
		const body = tempOutfitterFactory.create({
			'tempOutfitterFields': {
				'activityDescription': descr
			}
		});
		const result = wrapSudsPrep(body, {}, true);
		const expected = [
			'ID on Open Forest platform: 90.',
			'Rename me rename me rename me.'
		].join(' \n');
		expect(result['/application'].purpose).to.eql(expected);

	});

	it('generates the purpose field correctly and adds line breaks to a field with "linebreak" in the body ', function(){
		const body = noncommercialFactory.create();
		const result = wrapSudsPrep(body, noncommercialSchema, true);
		const expected = [
			'ID on Open Forest platform: 90.',
			'Activity Description: PROVIDING WHITEWATER OUTFITTING AND GUIDING ACTIVITIES ON NATIONAL FOREST LANDS.',
			'Location Description: string.',
			'Start Date Time: 2013-01-12T12:00:00Z.',
			'End Date Time: 2013-01-19T12:00:00Z.',
			'Number Participants: 45.',
			'Number Spectators: .'
		].join(' \n ');
		expect(result['/application'].purpose).to.eql(expected);
	});

	it('populates ePermitId correctly', function () {
		const body = tempOutfitterFactory.create({});
		const result = wrapSudsPrep(body, {}, true);
		expect(result['/application'].epermitId).to.eql('EP-3850-90');
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

//
//*******************************************************************
describe('Tests the populateValues function', function(){

	it('should return empty given empty parameters', function(){
		expect(populateValues({}, {}, [], true))
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

describe('tests the setContactGETOptions function.', function () {

	const token = 'asdf';
	const getApiObj = () => {
		return {
			GET: {
				'/contact/lastname/{lastName}': { request: null },
				'/contact/orgcode/{orgCode}': { request: null } }
		};
	}; // have to use function to recreate this this in each test because deep properties make copying awkward
	
	it('should return appropriate info for person applications.', function () {
		const apiObj = getApiObj();
		const testInfo = noncommercialFactory.create();
		const person = true;
		const result = setContactGETOptions(testInfo.applicantInfo, person, token, apiObj);
		expect(result.logUri).to.eql('/contact/lastname/{lastName}');
		expect(result.apiCallLogObject.GET['/contact/lastname/{lastName}']).to.eql({ request: { lastName: 'Doe' } });
		expect(result.apiCallLogObject.GET['/contact/orgcode/{orgCode}']).to.eql({ request: null });
		expect(result.requestParams).to.eql({
			method: 'GET',
			uri: `${auth.SUDS_API_URL}/contact/lastname/Doe`,
			json: true,
			headers: { Authorization: 'Bearer asdf' }
		});
	});

	it('should return appropriate info for organization applications.', function () {
		const apiObj = getApiObj();
		const testInfo = noncommercialFactory.create({ 'applicantInfo.organizationName': 'Umbrella Corp' });
		const person = false;
		const result = setContactGETOptions(testInfo.applicantInfo, person, token, apiObj);
		expect(result.logUri).to.eql('/contact/orgcode/{orgCode}');
		expect(result.apiCallLogObject.GET['/contact/orgcode/{orgCode}']).to.eql({ request: { orgCode: 'Umbrella Corp' } });
		expect(result.apiCallLogObject.GET['/contact/lastname/{lastName}']).to.eql({ request: null });
		expect(result.requestParams).to.eql({
			method: 'GET',
			uri: `${auth.SUDS_API_URL}/contact/orgcode/Umbrella Corp`,
			json: true,
			headers: { Authorization: 'Bearer asdf' }
		});
	});
});

//*******************************************************************
