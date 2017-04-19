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

const AWS = require('aws-sdk');

//*************************************************************
// AWS

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION;
const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

AWS.config.update({
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	region: AWS_REGION
});

const s3 = new AWS.S3();

//*************************************************************

/**
 * Uploads file to S3
 * @param  {[type]}   fileInfo - Information about file, include the contents of it in hex
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
