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

//*************************************************************
// AWS

const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;
const s3 = config.getStoreObject();

//*************************************************************

/**
 * Uploads file to S3
 * @param  {Array}   fileInfo - Information about file, include the contents of it in hex
 * @param  {Function} callback - function to call after uploading
 */
function uploadFile(fileInfo, callback){
	const params = {
		Bucket: AWS_BUCKET_NAME, 
		Key: fileInfo.keyname,
		Body: fileInfo.buffer,
		ACL: 'private' 
	};

	s3.putObject(params, function(err, data) {
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
 * @param  {Number}   controlNumber - controlNumber of application file is associated with
 * @param  {String}   fileName      - name of file to retreive
 * @param  {Function} callback      - function to call after file has been retreived, or error returned
 */
function getFile(controlNumber, fileName, callback){

	const filePath = `${controlNumber}/${fileName}`;

	const getParams = {
		Bucket: AWS_BUCKET_NAME, 
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

module.exports.getFile = getFile;
module.exports.uploadFile = uploadFile;
