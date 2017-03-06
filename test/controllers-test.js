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
special_uses.build_error_message = require('../controllers/permits/special-uses/utility.js');

//*******************************************************************

describe('API Controllers: build error message',function(){

    it('should return "firstName is a required field!"',function(){
    
        var errors = ['firstName'];
        expect( special_uses.build_error_message.build_error_message(errors) ).to.be.equal('firstName is a required field!');
    
    });

    it('should return "firstName and lastName are required fields!"',function(){
    
        var errors = ['firstName', 'lastName'];
        expect( special_uses.build_error_message.build_error_message(errors) ).to.be.equal('firstName and lastName are required fields!');
    
    });
    
});

//*******************************************************************
