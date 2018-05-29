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
const vcapConstants = require('./vcap-constants.js');

const AWS_ACCESS_KEY_ID = vcapConstants.s3.accessKeyId;
const AWS_SECRET_ACCESS_KEY = vcapConstants.s3.secretAccessKey;
const AWS_REGION = vcapConstants.s3.REGION;
const AWS_BUCKET_NAME = vcapConstants.s3.BUCKET;

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
