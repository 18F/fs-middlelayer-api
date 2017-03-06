/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

"use strict";

//*******************************************************************
// required modules

var outfitters = require("./outfitters");

//*******************************************************************
// controller

var get = {};

// get all

get.all = function(req){

    var outfitter = outfitters.get.all(req)["outfitters"];

    var commercial = {
        "response":{
            "success" : true,
            "api": "FS ePermit API",
            "type": "controller",
            "verb": "get",
            "src": "json",
            "route": "permits/special-uses/commercial"
        },
        "commercial":{
            "outfitters": outfitter
        }
    };

    return commercial;

};

//*******************************************************************
// exports

module.exports.get = get;
