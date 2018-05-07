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

const config = require('./storeConfig.js');
const async = require('async');
const zipper = require ('s3-zip');

//*************************************************************
// AWS

const AWS = config.getStoreObject();
const fileValidation = require('./fileValidation.js');
const db = require('./db.js');
const error = require('./errors/error.js');

//*************************************************************

/**
 * Uploads file to S3
 * @param  {Array}   fileInfo - Information about file, include the contents of it in hex
 * @param  {Function} callback - function to call after uploading
 */
function uploadFile(fileInfo, callback){
	const s3 = new AWS.S3();

	const params = {
		Bucket: config.bucketName, 
		Key: fileInfo.keyname,
		Body: fileInfo.buffer,
		ACL: 'private' 
	};

	s3.putObject(params, function(err) {
		if (err) {
			console.error(err);
			return callback(err);
		}
		else {
			return callback(null);
		}      
	});
}

/**
 * Retreives file from S3
 * @param  {Number}   controlNumber - controlNumber of application file is associated with
 * @param  {String}   fileName      - name of file to retreive
 * @param  {Function} callback      - function to call after file has been retreived, or error returned
 */
function getFile(controlNumber, fileName, callback){
	const s3 = new AWS.S3();
	const filePath = `${controlNumber}/${fileName}`;

	const getParams = {
		Bucket: config.bucketName, 
		Key: filePath
	};

	s3.getObject(getParams, function(err, data) {

		if (err) {
			console.error(err);
			return callback(err, null);
		}
		else {
			return callback(null, data);
		}

	});
}

/**
 * Retreives file from S3
 * @param  {Number}	  controlNumber - controlNumber of application files is associated with
 * @param  {Array}    dbFiles       - database file objects associated with that controlNumber.
 * @param  {Object}   res           - response object
 */
function getFilesZip(controlNumber, dbFiles, res){
	const s3Client = new AWS.S3();

	const filePath = `${controlNumber}`;

	const fileNames = [];

	dbFiles.forEach((dbFile)=>{
		fileNames.push(dbFile.filePath);
	});

	const archiveName = `${filePath}.zip`;

	res.set('Content-Type', 'application/zip');
	res.set('Content-Disposition', 'attachment; filename=' + archiveName);

	try {
		zipper
			.archive({ s3: s3Client, bucket: config.bucketName }, filePath, fileNames)
			.pipe(res);

	} 
	catch (e) {
		const err = 'catched error: ' + e;
		console.log(err);
		context.fail(err);
	}
	
}

/** Saves all information for a file upload to the DB and uploads the file to S3.
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Array} possbileFiles - list of all files that can be uploaded for this permit type
 * @param  {Array} files - Files being uploaded and saved
 * @param  {String} controlNumber - Control number of the application being processed
 * @param  {Object} application - Body of application being submitted
 * @param  {Function} callback - Function to be called after attempting to save the files.
 */
function saveAndUploadFiles(req, res, possbileFiles, files, controlNumber, application, callback) {

	const asyncTasks = [];

	possbileFiles.forEach((fileConstraints) => {

		asyncTasks.push(function (callback) {

			const key = Object.keys(fileConstraints)[0];
			if (files[key]) {
				const fileInfo = fileValidation.getFileInfo(files[key], fileConstraints);
				fileInfo.keyname = `${controlNumber}/${fileInfo.filename}`;
				uploadFile(fileInfo, function (err) {
					if (err) {
						console.error(err);
						return error.sendError(req, res, 500, 'error while storing files in data store.');
					}
					else {
						db.saveFile(application.id, fileInfo, function (err) {
							if (err) {
								console.error(err);
								return error.sendError(req, res, 500, 'error while saving file information to the database.');
							}
							else {
								return callback(null);
							}
						});
					}
				});
			}
			else {
				return callback(null);
			}
		});
	});
	async.parallel(asyncTasks, function (err) {
		if (err) {
			return callback(err);
		}
		else {
			return callback(null);
		}
	});
}

/** Controller for GET routes with a control number and a file name
 * @param  {Object} req - request object
 * @param  {Object} res - response object
 * @param  {Object} reqData - Object containing information about the request and the route requested
 * @param  {String} reqData.path - Path being requested
 * @param  {Array} reqData.tokens - Array of all tokens present in path being requested
 * @param  {Object} reqData.matches - Object with key pair values of all tokens present in the request
 * @param  {Object} reqData.schema - Schema of the route requested
 */
function getControlNumberFileName(req, res, reqData) {

	const controlNumber = reqData.matches.controlNumber;
	const fileName = reqData.matches.fileName;

	const filePath = controlNumber + '/' + fileName;

	db.getFile(filePath, function (err, file) {

		if (err) {
			console.error(err);
			error.sendError(req, res, 500, 'error while getting file from data store.');
		}
		else {
			if (file) {

				getFile(controlNumber, fileName, function (err, data) {

					if (err) {
						console.error(err);
						error.sendError(req, res, 404, 'file not found in the database.');
					}
					else {
						res.attachment(file.fileName);
						res.send(data.Body);
					}

				});
			}
			else {
				error.sendError(req, res, 404, 'file not found in the data store.');
			}
		}
	});

}

module.exports.getFilesZip = getFilesZip;
module.exports.saveAndUploadFiles = saveAndUploadFiles;
module.exports.getControlNumberFileName = getControlNumberFileName;
