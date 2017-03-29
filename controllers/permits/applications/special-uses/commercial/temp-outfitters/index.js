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

const tempOutfittersData = include('test/data/basicGET.json');

//*******************************************************************
// validation

const validateSpecialUse = include('controllers/permits/applications/special-uses/validate.js');
const util = include('controllers/permits/applications/special-uses/utility.js');
const dbUtil = include('controllers/permits/applications/special-uses/dbUtil.js');
const error = include('error.js');

//*******************************************************************
// controller

const get = {};
const put = {};

// get id

get.id = function(req, res){
	
	let jsonData = {};

	const jsonResponse = {};
	jsonResponse.success = false;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = 'get';
	jsonResponse.src = 'json';
	jsonResponse.route = 'permits/special-uses/commercial/temp-outfitters/{controlNumber}';

	const cnData = tempOutfittersData[1095010356];

	if (cnData){

		const tempOutfittersFields = {};
		
		tempOutfittersFields.activityDescription = cnData.purpose;
		tempOutfittersFields.locationDescription = null;
		tempOutfittersFields.startDateTime = '2017-04-12 09:00:00';
		tempOutfittersFields.endDateTime = '2017-04-15 20:00:00';
		tempOutfittersFields.insuranceCertificate = 'insuranceCertificate.pdf';
		tempOutfittersFields.goodStandingEvidence = 'goodStandingEvidence.pdf';
		tempOutfittersFields.operatingPlan = 'operatingPlan.pdf';

		jsonData = util.copyGenericInfo(cnData, jsonData);
		jsonData.tempOutfitterFields = tempOutfittersFields;

		delete jsonData.noncommercialFields;

		dbUtil.getApplication(1000000000, function(err, appl){
			if (err){
				console.error(err);
				error.sendError(req, res, 400, 'error getting application from database');
			}
			else {
				
				jsonData.applicantInfo.website = appl.website_addr;
				jsonResponse.success = true;
				const toReturn = Object.assign({}, {response:jsonResponse}, jsonData); 

				res.json(toReturn);
			}
		});
	}

};

// put id

put.id = function(req, res){

	const controlNumber = req.params.id;

	const validateRes = validateSpecialUse.validateInput('tempOutfitters', req);
	
	if (validateRes.success){

		const postData = util.createPost(controlNumber, req.body);

		const response = include('test/data/tempOutfitters.put.id.json');

		response.apiRequest = postData;
	
		res.json(response);
	
	}
	else {
	
		error.sendError(req, res, 400, validateRes.errorMessage);
	
	}

};

function fileErrors(missingFiles){

	let output = '';
	missingFiles.forEach((missing)=>{
		output = `${output}${missing} must be provided. `;
	});
	output = output.trim();
	return output;
}
// post

const post = function(req, res){

	const filesUploadList = [
		'guideDocumentation',
		'acknowledgementOfRiskForm',
		'insuranceCertificate',
		'goodStandingEvidence',
		'operatingPlan'
	];
	
	if (Object.keys(req.files).length === 0) {
		error.sendError(req, res, 400, fileErrors(filesUploadList));
	}
	else {
		const missingFiles = [];
		for (let i = 0; i < filesUploadList.length; i++ ) {

			if (!req.files[filesUploadList[i]]) {
				missingFiles.push(filesUploadList[i]);
			}		
			else {
				
				util.putUpload( req.files[filesUploadList[i]], filesUploadList[i], 'abc123');

			}
		}

		if (missingFiles.length !== 0){

			error.sendError(req, res, 400, fileErrors(missingFiles));

		}
		else {

			const validateRes = validateSpecialUse.validateInput('tempOutfitters', req);

			if (validateRes.success){

				const postData = util.createPost(null, req.body);

				const response = include('test/data/tempOutfitters.post.json');

				response.apiRequest = postData;

				// api database updates
				const controlNumber = Math.floor((Math.random() * 10000000000) + 1);

				let website;

				if (postData.applicantInfo.website){
					website = postData.applicantInfo.website;
				}

				dbUtil.saveApplication(controlNumber, postData.tempOutfitterFields.formName, website, function(err, appl) {

					if (err) {
						error.sendError(req, res, 400, 'error saving application in database');
					}
					else {
						dbUtil.saveFile(appl.id, 'inc', req.files.insuranceCertificate[0].fieldname, function(err, file) {

							if (err) {
								error.sendError(req, res, 400, 'error saving file in database');
							}
							else {
								dbUtil.saveFile(appl.id, 'gse', req.files.goodStandingEvidence[0].fieldname, function(err, file) {

									if (err) {
										error.sendError(req, res, 400, 'error saving file in database');
									}
									else {
										dbUtil.saveFile(appl.id, 'opp', req.files.operatingPlan[0].fieldname, function(err, file) {

											if (err) {
												error.sendError(req, res, 400, 'error saving file in database');
											}
											else {
												res.json(response);
											}

										});
									}
								});
							}
						});
					}
				});
			}
			else {
			
				error.sendError(req, res, 400, validateRes.errorMessage, validateRes.errors);
			
			}

		}

	}

};

//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
