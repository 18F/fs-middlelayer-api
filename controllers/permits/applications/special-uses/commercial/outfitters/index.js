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

const include = require('include')(__dirname);
const AWS = require('aws-sdk');

const outfittersData = include('test/data/basicGET.json');

//*******************************************************************
// validation

const validateSpecialUse = include('controllers/permits/applications/special-uses/validate.js');
const util = include('controllers/permits/applications/special-uses/utility.js');
const error = include('error.js');

//*************************************************************
// AWS

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY
});

const s3 = new AWS.S3();

//*******************************************************************
// controller

const get = {};
const put = {};

// get id

get.id = function(req, res){
    
	const jsonData = {};

	const jsonResponse = {};
	jsonResponse.success = false;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = 'get';
	jsonResponse.src = 'json';
	jsonResponse.route = 'permits/special-uses/commercial/outfitters/{controlNumber}';
    
	jsonData.response = jsonResponse;

	const cnData = outfittersData[1095010356];

	if (cnData){
        
		const outfittersFields = {};
        
		outfittersFields.activityDescription = cnData.purpose;
		outfittersFields.locationDescription = null;
		outfittersFields.startDateTime = '2017-04-12 09:00:00';
		outfittersFields.endDateTime = '2017-04-15 20:00:00';
		outfittersFields.insuranceCertificate = 'insuranceCertificate.pdf';
		outfittersFields.goodStandingEvidence = 'goodStandingEvidence.pdf';
		outfittersFields.operatingPlan = 'operatingPlan.pdf';

		util.copyGenericInfo(cnData, jsonData);
		jsonData.tempOutfitterFields = outfittersFields;    

		jsonResponse.success = true;
	}
    
	res.json(jsonData);
    
};

// put id

put.id = function(req, res){

	const controlNumber = req.params.id;

	const validateRes = validateSpecialUse.validateInput('outfitters', req);
    
	if (validateRes.success){

		const postData = util.createPost('outfitters', controlNumber, req.body);

		const response = include('test/data/outfitters.put.id.json');

		response.apiRequest = postData;
    
		res.json(response);
    
	}
	else {
    
		error.sendError(req, res, 400, validateRes.errorMessage);
    
	}

};

// post

const post = function(req, res){

	console.log('post start');

	const validateRes = validateSpecialUse.validateInput('outfitters', req);
    
	let guideDocumentation = {};
	let acknowledgementOfRiskForm = {};
	let insuranceCertificate = {};
	let goodStandingEvidence = {};
	let operatingPlan = {};
	
	console.log('req.files : ' + JSON.stringify(req.files));
	
	guideDocumentation.file = req.files.guideDocumentation;
	if (req.files.guideDocumentation) {
		guideDocumentation.file = req.files.guideDocumentation[0];
	}
	
	if (guideDocumentation.file === undefined) {		
		console.log('guideDocumentation undefined error');
	}
	else {
		guideDocumentation.originalname = guideDocumentation.file.originalname;
		guideDocumentation.size = guideDocumentation.file.size;
		guideDocumentation.mimetype = guideDocumentation.file.mimetype;
		guideDocumentation.encoding = guideDocumentation.file.encoding;
		guideDocumentation.buffer = guideDocumentation.file.buffer;
		//guideDocumentation.buffer = new Buffer(guideDocumentation.file.buffer, 'base64');
		
		console.log('guideDocumentation.originalname : ' + guideDocumentation.originalname);
		console.log('guideDocumentation.size : ' + guideDocumentation.size);
		console.log('guideDocumentation.mimetype : ' + guideDocumentation.mimetype);
	
		let params = {
			Bucket: AWS_BUCKET_NAME, 
			Key: 'temp/'+ Date.now() +'-'+ guideDocumentation.originalname,
			Body: guideDocumentation.buffer,
			ACL: 'private' 
		};

		s3.putObject(params, function(err, data) {
			if (err) {
				console.error(err, err.stack); 
			}
			else {     
				console.log('s3 put success');  
				console.log(data);   
			}      
		});			
	}
		
	
	if (validateRes.success){

		const postData = util.createPost('outfitters', null, req.body);

		const response = include('test/data/outfitters.post.json');

		response.apiRequest = postData;
    
		res.json(response);
    
	}
	else {
    
		error.sendError(req, res, 400, validateRes.errorMessage, validateRes.errors);
    
	}

};

//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
