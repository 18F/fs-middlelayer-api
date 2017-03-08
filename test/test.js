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

describe("FS ePermit API", function() {

    var token;

    before(function(done) {

        request(server)
        .post("/auth")
        .set("Accept", "application/json")
        .send({ "username": "user", "password": "12345" })
        .expect("Content-Type", /json/)
        .expect(200)
        .end(function(err, res) {

            token = res.body.token;
            done();
        
        });
    
    });
    
    it("should return html format if web page", function(done) {

        request(server)
            .get("/")
            .set("x-access-token", token)
            .expect("Content-Type", /html/)
            .expect(200, done);
    
    });
    
    it("should return a 404 error if invalid", function(done) {

        request(server)
            .get("/asdfsad")
            .set("x-access-token", token)
            .expect(404, done);
    
    });
    
    it("should not have x-powered-by header", function(done) {

        request(server)
            .get("/permits/special-uses/noncommercial/1234567890")
            .set("x-access-token", token)
            .expect(function(res) {

                expect(res.headers).to.not.have.key("x-powered-by");
            
            })
            .expect(200, done);
    
    });
    
    it("should have cors support", function(done) {

        request(server)
            .get("/permits/special-uses/noncommercial/1234567890")
            .set("x-access-token", token)
            .expect(function(res) {

                expect(res.headers["access-control-allow-origin"]).to.equal("*");
            
            })
            .expect(200, done);
    
    });

});

//*******************************************************************

