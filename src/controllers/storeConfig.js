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
const S3_INFO = require('./vcap.js').S3_INFO;

const AWS_ACCESS_KEY_ID = S3_INFO.access_key_id;
const AWS_SECRET_ACCESS_KEY = S3_INFO.secret_access_key;
const AWS_REGION = S3_INFO.region;
const AWS_BUCKET_NAME = S3_INFO.bucket;

AWS.config.update({
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	region: AWS_REGION
});

function getStoreConfig(){
	const config = {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
		region: AWS_REGION,
		bucket: AWS_BUCKET_NAME
	};
	return config;
}

function getStoreObject(){
	return AWS;
}

module.exports.getStoreObject = getStoreObject;
module.exports.getStoreConfig = getStoreConfig;
module.exports.bucketName = AWS_BUCKET_NAME;
