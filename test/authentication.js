/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

"use strict";

//*******************************************************************

var request = require("supertest");
var server = require("../index.js");

var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var should = chai.should;

//*******************************************************************

describe("authentication validation", function() {

    it("should return valid json with a 401 status code for invalid username or password", function(done) {

        request(server)
            .post("/auth")
            .set("Accept", "application/json")
            .send({ "username": "apiuser", "password": "apipwd" })
            .expect(401, done);

    });

    it("should return valid json with token and a 200 status code for a successful authentication", function(done) {

        request(server)
            .post("/auth")
            .set("Accept", "application/json")
            .send({ "username": "user", "password": "12345" })
            .expect(function(res){

                expect(res.body).to.have.property("token");
            
            })
            .expect(200, done);
    
    });

    it("should return valid json with 403 when no token provided for a noncommercial GET request", function(done) {

        request(server)
            .get("/permits/special-uses/noncommercial/1234567890")
            .expect("Content-Type", /json/)
            .expect(403, done);
    
    });


    it("should return valid json with 401 when an invalid token provided for a noncommercial GET request", function(done) {

        request(server)
            .get("/permits/special-uses/noncommercial/1234567890")
            .set("x-access-token", "invalid-token")
            .expect("Content-Type", /json/)
            .expect(401, done);
    
    });

});
