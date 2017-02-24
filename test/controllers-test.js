/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************

var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

var special_uses = {};

special_uses.validate = require('../controllers/permits/special-uses/validate.js');

//*******************************************************************

describe('API Controllers: validate GET permitId', function() {
    
    it('should return valid false if id length < 10', function() {
        expect( special_uses.validate.permit_id(123456789) ).to.be.equal(false);
    });

    it('should return valid false if id length > 10', function() {
        expect( special_uses.validate.permit_id(12345678901) ).to.be.equal(false);
    });
    
    it('should return valid true if id is valid', function() {
        expect( special_uses.validate.permit_id(1234567890) ).to.be.equal(true);
    });

});

//*******************************************************************
