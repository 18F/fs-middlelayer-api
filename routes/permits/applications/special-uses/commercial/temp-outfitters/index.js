/*

  ___ ___       ___               _ _       _   ___ ___ 
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| | 
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// required modules

const express = require('express');
const router = express.Router();
const include = require('include')(__dirname);
const multer = require('multer');

const tempOutfitters = include('controllers/permits/applications/special-uses/commercial/temp-outfitters');

//*******************************************************************
// storage

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//*******************************************************************
// router

// get id
router.get('/:id(\\d+)', function(req, res){
    
	tempOutfitters.get.id(req, res);
    
});

// put id
router.put('/:id(\\d+)', function(req, res){
    
	tempOutfitters.put.id(req, res);
    
});

// post

const postUpload = upload.fields([
	{ name: 'guideDocumentation', maxCount: 1 },
	{ name: 'acknowledgementOfRiskForm', maxCount: 1 },
	{ name: 'insuranceCertificate', maxCount: 1 },
	{ name: 'goodStandingEvidence', maxCount: 1 },
	{ name: 'operatingPlan', maxCount: 1 }
]);

router.post('/', postUpload, function(req, res){
    
	tempOutfitters.post(req, res);
    
});

//*******************************************************************
// exports

module.exports = router;
