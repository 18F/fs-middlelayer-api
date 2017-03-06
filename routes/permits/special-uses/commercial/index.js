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

var express = require("express");
var router = express.Router();
var include = require("include")(__dirname);

var outfitters = require("./outfitters");
var commercial = include("controllers/permits/special-uses/commercial");

//*******************************************************************
// router

router.use("/outfitters", outfitters);

router.get("/", function(req, res){

    res.json(commercial.get.all(req));

});

module.exports = router;
