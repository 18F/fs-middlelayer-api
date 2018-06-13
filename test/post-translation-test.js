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

const SUDSconnection =  require('../src/controllers/sudsconnection.js');

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