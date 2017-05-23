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
const s3zipper = require ('aws-s3-zipper');

//*************************************************************
// AWS

const AWS = config.getStoreObject();

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
 * @param  {Function} callback      - function to call after files have been retreived, or error returned
 */
function getFilesZip(controlNumber, dbFiles, res, callback){

	const zipper = new s3zipper(config.getStoreConfig());

	const filePath = `${controlNumber}`;

	const storeFiles = [];
	const fileNames = [];

	dbFiles.forEach((dbFile)=>{
		fileNames.push(dbFile.filePath);
	});

	zipper.getFiles({
		folderName: filePath
	},
    function (err, fileResult) {
	if (err){
		console.error(err);
		return callback(err);
	}
	else {
			
		if (fileResult.files.length === 0 ){
			return callback('files not found');
		}
		else {
				
			fileResult.files.forEach((storeFile)=>{

				storeFiles.push(storeFile.Key);

			});	

			zipper.filterOutFiles = function(file){
				if (fileNames.indexOf(file.Key) >= 0){
					return file;
				}
				else {
					return null;
				}
			};

			res.set('Content-Type', 'application/zip');
			res.set('Content-Disposition', 'attachment; filename=' + controlNumber + '.zip');

			zipper.streamZipDataTo({
				folderName: filePath,
				pipe: res,
				recursive: true
			},
				function (err, result) {
					if (err){
						console.error(err);
						return callback(err);
					}
					else {
						return callback(null);	
					}
				}
			);

		}
		
	}
});

}

module.exports.getFile = getFile;
module.exports.uploadFile = uploadFile;
module.exports.getFilesZip = getFilesZip;
