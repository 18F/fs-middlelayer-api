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
const path = require('path');
const tempOutfitterData = include('test/data/basicGET.json');

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
const fileTypes = {
	'gud': 'guideDocumentation',
	'arf': 'acknowledgementOfRiskForm',
	'inc': 'insuranceCertificate',
	'gse': 'goodStandingEvidence',
	'opp': 'operatingPlan'
};

// get id

get.id = function(req, res){
	
	let jsonData = {};

	const controlNumber = req.params.id;

	const jsonResponse = {};
	jsonResponse.success = false;
	jsonResponse.api = 'FS ePermit API';
	jsonResponse.type = 'controller';
	jsonResponse.verb = 'get';
	jsonResponse.src = 'json';
	jsonResponse.route = 'permits/special-uses/commercial/temp-outfitters/{controlNumber}';

	const basicData = tempOutfitterData[1095010356];

	if (basicData){

		dbUtil.getApplication(controlNumber, function(err, applicationData, fileData){

			if (err){
				console.error(err);
				error.sendError(req, res, 400, 'error getting application from database');
			}
			else {

				const applData = JSON.parse(JSON.stringify(applicationData));

				if (fileData){

					fileData.forEach(function(file){
						const fileType = fileTypes[file.file_type];
						applData[fileType] = file.file_name;
					});

				}

				jsonData = util.copyGenericInfo(basicData, applData, jsonData);				

				delete jsonData.noncommercialFields;

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

function outputFileErrors(missingFiles){

	let output = '';
	missingFiles.forEach((missing)=>{
		output = `${output}${missing} must be provided. `;
	});
	output = output.trim();
	return output;
}

// post

function postData(req, res, uploadFiles, controlNumber, fileErrors){

	const postData = util.createPost(null, req.body);

	const response = include('test/data/tempOutfitters.post.json');

	response.apiRequest = postData;

	dbUtil.saveApplication(controlNumber, postData, function(err, appl) {

		if (err) {
			error.sendError(req, res, 400, 'error saving application in database');
		}
		else {

			uploadFiles.forEach(function(uploadFile){

				dbUtil.saveFile(appl.id, uploadFile, function(err, file) { // eslint-disable-line no-unused-vars

					if (err) {
						fileErrors.push(uploadFile.filetype + ' failed to save.');
					}

				});

			});
									
		}

		if (fileErrors.length !== 0){

			error.sendError(req, res, 400, util.concatErrors(fileErrors));

		}
		else {
			res.json(response);
		}

	});	

}

const post = function(req, res){

	const filesUploadList = [
		['guideDocumentation', 'gud'],
		['acknowledgementOfRiskForm', 'arf'],
		['insuranceCertificate', 'inc'],
		['goodStandingEvidence', 'gse'],
		['operatingPlan', 'opp']
	];

	const requiredFilesUploadList = [
		'insuranceCertificate',
		'goodStandingEvidence',
		'operatingPlan'
	];	

	if (Object.keys(req.files).length === 0) {
		error.sendError(req, res, 400, outputFileErrors(requiredFilesUploadList));
	}
	else {
		
		const validateRes = validateSpecialUse.validateInput('tempOutfitters', req);

		if (validateRes.success){

			const controlNumber = Math.floor((Math.random() * 10000000000) + 1);

			const uploadFiles = [];

			const missingFiles = [];

			const fileErrors = [];

			for (let i = 0; i < requiredFilesUploadList.length; i++ ) {
				if (!req.files[requiredFilesUploadList[i]]) {
					missingFiles.push(requiredFilesUploadList[i]);
				}
			}

			if (missingFiles.length !== 0){

				error.sendError(req, res, 400, outputFileErrors(missingFiles));

			}

			else {

				for (let i = 0; i < filesUploadList.length; i++ ) {

					const uploadField = filesUploadList[i][0];

					if (req.files[uploadField]) {

						const uploadFile = {};

						const currentFile = req.files[uploadField];

						uploadFile.file = currentFile[0];

						const filename = path.parse(uploadFile.file.originalname).name;

						uploadFile.originalname = uploadFile.file.originalname;
						uploadFile.filetype = uploadField;
						uploadFile.filetypecode = filesUploadList[i][1];
						uploadFile.ext = path.parse(uploadFile.file.originalname).ext;
						uploadFile.size = uploadFile.file.size;
						uploadFile.mimetype = uploadFile.file.mimetype;
						uploadFile.encoding = uploadFile.file.encoding;
						uploadFile.buffer = uploadFile.file.buffer;
						uploadFile.filename = uploadField + '-' + filename + '-' + Date.now() + uploadFile.ext;
						uploadFile.keyname = `${controlNumber}/${uploadFile.filename}`;
						uploadFiles.push(uploadFile);

						const fileError = validateSpecialUse.validateFile(uploadFile);

						if (fileError){
							fileErrors.push(fileError);
						}
					}
				}

				if (fileErrors.length !== 0){
					error.sendError(req, res, 400, util.concatErrors(fileErrors));
				}

				else if (uploadFiles.length > 0){

					util.uploadFiles(controlNumber, uploadFiles, function(err, data){  // eslint-disable-line no-unused-vars
						if (err){

							error.sendError(req, res, 400, 'error uploading files');

						}
						else {

							postData(req, res, uploadFiles, controlNumber, fileErrors);	

						}
						
					});
				}
				else {
					error.sendError(req, res, 400, 'files not found');
				}
			}

		}
		else {
		
			error.sendError(req, res, 400, validateRes.errorMessage, validateRes.errors);
		
		}

	}

};

//*******************************************************************
// exports

module.exports.get = get;
module.exports.put = put;
module.exports.post = post;
