/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

const AWS = require('mock-aws');
const chai = require('chai');
const expect = chai.expect;

const specialUses = {};

specialUses.validate = require('../src/controllers/validation.js');

const testObjects = require('./data/testObjects.json');
const outfittersObjects = testObjects.outfitters;
const noncommercialObjects = testObjects.noncommercial;

const factory = require('unionized');
const testTempOutfittersBody = require('./data/testInputTempOutfitters.json');
const testNoncommercialBody = require('./data/testInputNoncommercial.json');
const tempOutfitterFactory = factory.factory(testTempOutfittersBody);
const noncommercialFactory = factory.factory(testNoncommercialBody);
const errorFactory = factory.factory({
	field: undefined,
	errorType: undefined,
	expectedFieldType: undefined,
	enumMessage: undefined,
	dependency: undefined,
	anyOfFields: undefined
});

before(function(){
	if (process.env.npm_config_mock === 'Y'){
		AWS.mock('S3', 'putObject', { ETag: '"82e8674bebaea2797c28872c9a38ad43"' });
		AWS.mock('S3', 'getObject', testObjects.mockS3Get);
	}
});

after(function(){
	if (process.env.npm_config_mock === 'Y'){
		AWS.restore();
	}
});

describe('outfitters validation ', function(){
	describe('ensure field is present', function(){
		it('should report issues when no body is provided', function(){
			const actual = specialUses.validate.validateBody({}, outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'region', errorType: 'missing'}),
				errorFactory.create({field: 'forest', errorType: 'missing'}),
				errorFactory.create({field: 'district', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.firstName', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.lastName', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.areaCode', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.number', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.phoneType', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.emailAddress', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.mailingAddress', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.mailingCity', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.mailingZIP', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.mailingState', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.orgType', errorType: 'missing'}),
				errorFactory.create({field: 'type', errorType: 'missing'}),
				errorFactory.create({field: 'tempOutfitterFields', errorType: 'missing'}),
				errorFactory.create({field: 'tempOutfitterFields.activityDescription', errorType: 'missing'}),
				errorFactory.create({field: 'tempOutfitterFields.clientCharges', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no applicantInfo object is provided', function(){
			const actual = specialUses.validate.validateBody(tempOutfitterFactory.create({applicantInfo : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.firstName', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.lastName', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.areaCode', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.number', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.phoneType', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.emailAddress', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.mailingAddress', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.mailingCity', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.mailingZIP', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.mailingState', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.orgType', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no tempOutfitterFields object is provided', function(){
			const actual = specialUses.validate.validateBody(tempOutfitterFactory.create({tempOutfitterFields : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'tempOutfitterFields', errorType: 'missing'}),
				errorFactory.create({field: 'tempOutfitterFields.activityDescription', errorType: 'missing'}),
				errorFactory.create({field: 'tempOutfitterFields.clientCharges', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no applicantInfo/org type is provided', function(){
			const actual = specialUses.validate.validateBody(tempOutfitterFactory.create({'applicantInfo.orgType' : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.orgType', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no tempOutfitterFields/activity description is provided', function(){
			const actual = specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.activityDescription' : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'tempOutfitterFields.activityDescription', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no tempOutfitterFields/client charges is provided', function(){
			const actual = specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.clientCharges' : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'tempOutfitterFields.clientCharges', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when neither tempOutfitterFields/advertising url nor tempOutfitterFields/advertising description is provided', function(){
			const actual = specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.advertisingURL' : undefined, 'tempOutfitterFields.advertisingDescription' : undefined}), outfittersObjects.pathData, { errorArray: [] }).errorArray;
			const expected = [
				{errorType: 'anyOf', anyOfFields:['tempOutfitterFields.advertisingURL', 'tempOutfitterFields.advertisingDescription']}
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no tempOutfitterFields/small business is provided', function(){
			
			const actual = specialUses.validate.checkForSmallBusiness(tempOutfitterFactory.create({'tempOutfitterFields.smallBusiness' : undefined}), { errorArray: [] }).errorArray;
			const expected = [
				errorFactory.create({field: 'tempOutfitterFields.smallBusiness', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no tempOutfitterFields/individual is citizen is provided', function(){
			const actual = specialUses.validate.checkForIndividualIsCitizen(tempOutfitterFactory.create({'applicantInfo.orgType':'Person', 'tempOutfitterFields.individualIsCitizen' : undefined}), { errorArray: [] }).errorArray;
			const expected = [
				errorFactory.create({field: 'tempOutfitterFields.individualIsCitizen', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
	});
	describe('ensure fields are the right type', function(){
		it('should report issues when when the wrong type of tempOutfitterFields/activity description is provided', function(){
			const actual = specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.activityDescription' : 123}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'tempOutfitterFields.activityDescription', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when when the wrong type of tempOutfitterFields/client charges is provided', function(){
			const actual = specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.clientCharges' : 500}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'tempOutfitterFields.clientCharges', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
	});
});

describe('noncommercial validation', function(){
	describe('ensure field is present', function(){
		it('should report issues when no region is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({region : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'region', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no forest is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({forest : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'forest', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no district is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({district : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'district', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no first name is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.firstName' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.firstName', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no last name is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.lastName' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.lastName', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no day phone is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.areaCode', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.number', errorType: 'missing'}),
				errorFactory.create({field: 'applicantInfo.dayPhone.phoneType', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no day phone/area code is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.areaCode' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.areaCode', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no day phone/number is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.number' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.number', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no day phone/phone type is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.phoneType' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.phoneType', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no email address is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.emailAddress' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.emailAddress', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no mailing address is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingAddress' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingAddress', errorType: 'missing'})	
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no mailing city is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingCity' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingCity', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no mailing state is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingState' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingState', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no mailing zip is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingZIP' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingZIP', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no organization name is provided', function(){
			const actual = specialUses.validate.checkForOrgName(noncommercialFactory.create({'applicantInfo.orgType' : 'Corporation'}), { errorArray: [] }).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.organizationName', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no type is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'type' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'type', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no noncommercialFields object is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({noncommercialFields : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields', errorType: 'missing'}),
				errorFactory.create({field: 'noncommercialFields.activityDescription', errorType: 'missing'}),
				errorFactory.create({field: 'noncommercialFields.locationDescription', errorType: 'missing'}),
				errorFactory.create({field: 'noncommercialFields.startDateTime', errorType: 'missing'}),
				errorFactory.create({field: 'noncommercialFields.endDateTime', errorType: 'missing'}),
				errorFactory.create({field: 'noncommercialFields.numberParticipants', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no noncommercialFields/activity description is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.activityDescription' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields.activityDescription', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no noncommercialFields/location description is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.locationDescription' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields.locationDescription', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no noncommercialFields/start date time is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.startDateTime' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields.startDateTime', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no noncommercialFields/end date time is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.endDateTime' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields.endDateTime', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when no noncommercialFields/number participants is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.numberParticipants' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields.numberParticipants', errorType: 'missing'})
			];
			expect (actual).to.eql(expected);
		});
	});
	describe('ensure fields are the right type', function(){
		it('should report issues when the wrong type of applicantInfo/first name is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.firstName' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.firstName', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/last name is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.lastName' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.lastName', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/day phone/area code is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.areaCode' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.areaCode', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/day phone/number is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.number' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.number', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/day phone/phone type is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.phoneType' : 1}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.phoneType', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/day phone/extension is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.extension' : 1}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.extension', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/email address is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.emailAddress' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.emailAddress', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/mailing address is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingAddress' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingAddress', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/mailing city is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingCity' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingCity', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/mailing state is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingState' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingState', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of applicantInfo/mailing zip is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingZIP' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingZIP', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong type of noncommercialFields/activity description is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.activityDescription' : 123}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields.activityDescription', errorType: 'type', expectedFieldType:'string'})
			];
			expect (actual).to.eql(expected);
		});
	});
	describe('ensure fields are the right format', function(){
		
		it('should report issues when the wrong format of applicantInfo/day phone/area code is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.areaCode' : '12'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.areaCode', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong format of applicantInfo/day phone/number is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.number' : '12'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.dayPhone.number', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong format of applicantInfo/mailing state is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingState' : 'ORE'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingState', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong format of applicantInfo/mailing zip is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingZIP' : '123456'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.mailingZIP', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
		it('should not report issues when the right format of applicantInfo/mailing zip is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingZIP' : '123456789'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong format of region is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'region' : '123'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'region', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong format of forest is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'forest' : '123'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'forest', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong format of district is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'district' : '123'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'district', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong format of noncommercialFields/start date time is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.startDateTime' : '01-12-2012'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields.startDateTime', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues when the wrong format of noncommercialFields/end date time is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.endDateTime' : '01-12-2012'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'noncommercialFields.endDateTime', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
	});
	describe('ensure fields follow their pattern', function(){
		it('should report issues for invalid pattern for email address is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.emailAddress' : 'invalid'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.emailAddress', errorType: 'format'})
			];
			expect (actual).to.eql(expected);
		});
	});
	describe('ensure fields with enumuration are validated', function(){
		it('should report issues for invalid option for type is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'type' : 'invalid'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				{
					field: 'type', 
					errorType: 'enum', 
					enumMessage: 'is not one of enum values: noncommercial,tempOutfitters',
					anyOfFields: undefined,
					dependency: undefined
				}
			];
			expect (actual).to.eql(expected);
		});
		it('should report issues for invalid option for applicant info/org type is provided', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.orgType' : 'invalid'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				{
					field: 'applicantInfo.orgType',
					errorType: 'enum', 
					enumMessage: 'is not one of enum values: Association,Corporation,Education,Federal Government,State Government,Local Govt,Married Common Property,Limited Liability Company (LLC),Limited Liability Partnership (LLP),Person,Trust',
					anyOfFields: undefined,
					dependency: undefined
				}
			];
			expect (actual).to.eql(expected);
		});
	});
	describe('ensure fields with a dependency are checked', function(){
		it('should report issues for orgName', function(){
			const actual = specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.organizationName' : 'theOrg'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				{
					field: 'applicantInfo.organizationName', 
					errorType: 'dependencies', 
					dependency:'applicantInfo.orgType',
					anyOfFields:undefined
				}
			];
			expect (actual).to.eql(expected);
		});
	});
	describe('ensure fields is right length', function(){
		it('should report issues for invalid length', function(){
			const actual = specialUses.validate.getFieldValidationErrors(noncommercialFactory.create({'applicantInfo.firstName' : 'Josdfsdfsdfsdasdasdhnaaaaaaaaaaaaasasasasasaasaaaaasahbsdbahsdbhasdbasbdbahsdbasbdbashdbashjdbashdbahsdbahsdbahsdbashdbahsdbhasdbashdbahjsdbhasbdahsbdhasbdhabsdhjabsdhjasbdhjasbdhjasbdjhasbdjahsbdahsbdahsdbahsdbahjsbdhjasbdahsdbasbdahsdbahsbdahsdbjhasbdahsbdhjasdbahbdbdbb'}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray;
			const expected = [
				errorFactory.create({field: 'applicantInfo.firstName', errorType: 'length', expectedFieldType: 255})
			];
			expect (actual).to.eql(expected);
		});
	});
});
