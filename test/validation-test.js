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

specialUses.validate = require('../src/controllers/validation.js');

const testObjects = require('./data/testObjects.json');
const outfittersObjects = testObjects.outfitters;
const noncommercialObjects = testObjects.noncommercial;

const factory = require('unionized');
const testTempOutfittersBody = require('./data/testInputTempOutfitters.json');
const testNoncommercialBody = require('./data/testInputNoncommercial.json');
const tempOutfitterFactory = factory.factory(testTempOutfittersBody);
const noncommercialFactory = factory.factory(testNoncommercialBody);

//*******************************************************************
// Validates input
// Ensuring all required fields are present
// All fields are the right type
// All fields with patterns match those patterns
// Fields with dependencies are checked
// Fields with enum values
// 
// One test for these
// 
// File uploads working
// Retreiving from S3 working
// Saving to DB working
// Retreiving from DB working
// Authorization working
// 
// 

describe('outfitters validation ', function(){
	describe('ensure field is present', function(){
		it('should report issues when no body is provided', function(){
			expect (
				specialUses.validate.validateBody({}, outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray.length
			)
			.to.be.equal(20);
		});
		it('should report issues when no applicantInfo object is provided', function(){
			expect (
				specialUses.validate.validateBody(tempOutfitterFactory.create({applicantInfo : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray.length
			)
			.to.be.equal(13);
		});
		it('should report issues when no tempOutfitterFields object is provided', function(){
			expect (
				specialUses.validate.validateBody(tempOutfitterFactory.create({tempOutfitterFields : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray.length
			)
			.to.be.equal(3);
		});
		it('should report issues when no tempOutfitterFields/activity description is provided', function(){
			expect (
				specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.activityDescription' : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no tempOutfitterFields/client charges is provided', function(){
			expect (
				specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.clientCharges' : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no tempOutfitterFields/client charges is provided', function(){
			expect (
				specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.clientCharges' : undefined}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
	});
	describe('ensure fields are the right type', function(){
		it('should report issues when no tempOutfitterFields/activity description is provided', function(){
			expect (
				specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.activityDescription' : 123}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no tempOutfitterFields/client charges is provided', function(){
			expect (
				specialUses.validate.validateBody(tempOutfitterFactory.create({'tempOutfitterFields.clientCharges' : 500}), outfittersObjects.pathData, outfittersObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
	});
});

describe('noncommercial validation', function(){
	describe('ensure field is present', function(){
		it('should report issues when no region is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({region : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no forest is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({forest : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no district is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({district : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no first name is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.firstName' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no last name is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.lastName' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no day phone is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(4);
		});
		it('should report issues when no day phone/area code is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.areaCode' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no day phone/number is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.number' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no day phone/phone type is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.dayPhone.phoneType' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no email address is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.emailAddress' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no mailing address is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingAddress' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no mailing city is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingCity' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no mailing state is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingState' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no mailing zip is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'applicantInfo.mailingZIP' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no type is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'type' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no noncommcialFields object is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({noncommercialFields : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(6);
		});
		it('should report issues when no noncommcialFields/activity description is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.activityDescription' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no noncommcialFields/location description is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.locationDescription' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no noncommcialFields/start date time is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.startDateTime' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no noncommcialFields/end date time is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.endDateTime' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
		it('should report issues when no noncommcialFields/number participants is provided', function(){
			expect (
				specialUses.validate.validateBody(noncommercialFactory.create({'noncommercialFields.numberParticipants' : undefined}), noncommercialObjects.pathData, noncommercialObjects.derefSchema).errorArray.length
			)
			.to.be.equal(1);
		});
	});
	/*
	it('', function(){
		const output = specialUses.validate.validateBody(tempOutfitterFactory.create({tempOutfitterFields : undefined}), testObjects.pathData, testObjects.derefSchema);
		//expect (output).to.be.equal('Applicant Info/First Name is a required field.');
    
	});
	*/
});
/*
describe('validation: validate file',function(){
	it('should', function(){

	};
});
*/
