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

var non_commercial = {};

non_commercial.validate = require('../controllers/permits/special-uses/non-commercial/validate.js');

//*******************************************************************

describe('API Controllers: validate non-commercial', function() {
    
    it('should return valid false if id length < 3', function() {
        expect( non_commercial.validate.permit_id(12) ).to.be.equal(false);
    });
    
    it('should return valid true if id is valid', function() {
        expect( non_commercial.validate.permit_id(12345) ).to.be.equal(true);
    });

});

//*******************************************************************
