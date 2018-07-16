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
const zipper = require ('s3-zip');
const logger = require('./utility.js').logger;
const util = require('./utility');

//*************************************************************
// AWS

const AWS = config.getStoreObject();
const fileValidation = require('./fileValidation.js');
const db = require('./db.js');
const errorUtil = require('./errors/error.js');

//*************************************************************

/**
 * Uploads file to S3
 * @param  {Array}   fileInfo - Information about file, include the contents of it in hex
 */
function uploadFile(fileInfo){
	const s3 = new AWS.S3();

	const params = {
		Bucket: config.bucketName,
		Key: fileInfo.keyname,
		Body: fileInfo.buffer,
		ACL: 'private'
	};
	return new Promise((fulfill, reject) => {
		s3.putObject(params, function (err) {
			if (err) {
				util.rejectWithEror(err, reject);
			}
			return fulfill();
		});
	});

}

/**
 * Retreives file from S3
 * @param  {Number}   controlNumber - controlNumber of application file is associated with
 * @param  {String}   fileName      - name of file to retreive
 */
function getFile(controlNumber, fileName){
	const s3 = new AWS.S3();
	const filePath = `${controlNumber}/${fileName}`;

	const getParams = {
		Bucket: config.bucketName, 
		Key: filePath
	};
	return new Promise((resolve, reject) => {
		s3.getObject(getParams, function (err, data) {
			if (err) {
				util.rejectWithEror(err, reject);
			}
			return resolve(data);
		});
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

	if (s3Client.config.credentials.accessKeyId === 'MINIOSERVER') {
		dbFiles.forEach((dbFile)=>{
			// Minio will add the paths again later, so we need to strip them here:
            // It's possible that later Minio upgrades will make this branch unnecessary.
			fileNames.push(dbFile.filePath.replace(filePath, ''));
		});
	}
	else {
		dbFiles.forEach((dbFile)=>{
			fileNames.push(dbFile.filePath);
		});
	}

	const archiveName = `${filePath}.zip`;

	res.set('Content-Type', 'application/zip');
	res.set('Content-Disposition', 'attachment; filename=' + archiveName);

	try {
		util.logControllerAction({controlNumber: controlNumber}, 'fileStore.getFilesZip');
		zipper
			.archive({ s3: s3Client, bucket: config.bucketName }, filePath, fileNames)
			.pipe(res);

	} 
	catch (e) {
		const err = 'catched error: ' + e;
		logger.error('ERROR: ', err);
		context.fail(err);
	}
	
}

/** Saves all information for a file upload to the DB and uploads the file to S3.
 * @param  {Array} possbileFiles - list of all files that can be uploaded for this permit type
 * @param  {Array} files - Files being uploaded and saved
 * @param  {String} controlNumber - Control number of the application being processed
 * @param  {Object} application - Body of application being submitted
 */
function saveAndUploadFiles(possbileFiles, files, controlNumber, application) {
	const asyncTasks = [];

	possbileFiles.forEach((fileConstraints) => {

		asyncTasks.push(
			new Promise((resolve, reject) => {
				const key = Object.keys(fileConstraints)[0];

				if (files[key]) {
					const fileInfo = fileValidation.getFileInfo(files[key], fileConstraints);
					fileInfo.keyname = `${controlNumber}/${fileInfo.filename}`;

					uploadFile(fileInfo)
						.then(() => {
							db.saveFile(application.id, fileInfo)
							.then(resolve())
							.catch((err) => {
								errorUtil.rejectWithError(err, reject, 'filestore.saveAndUpload.saveFile');
							});
						})
						.catch((err) => {
							errorUtil.rejectWithEror(err, reject, 'filestore.saveAndUpload.uploadFile');
						});
				}
				else {
					resolve();
				}
			})
		);
	});

	return Promise.all(asyncTasks);

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

	db.getFileInfoFromDB(filePath).then((storedFileInfo) => {
		getFile(controlNumber, fileName)
		.then((fileData) => {
			res.attachment(storedFileInfo.fileName);
			res.send(fileData.Body);
		})
		.catch((error) => {
			logger.error('ERROR:', error);
			errorUtil.sendError(req, res, 404, 'file not found in the database.');
		});
	}).catch((error) =>{
		logger.error('ERROR:', error);
		errorUtil.sendError(req, res, 500, 'error while getting file from data store.');
	});
}

module.exports.getFilesZip = getFilesZip;
module.exports.saveAndUploadFiles = saveAndUploadFiles;
module.exports.getControlNumberFileName = getControlNumberFileName;
