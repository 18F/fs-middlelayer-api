/**
 * Module for VCAP Constants
 * @module vcap-constants
 */

const vcapConstants = {};
/** VCAP environment variables are used by cloud.gov to pass in instance specific settings. */
let vcapServices;
if (process.env.VCAP_SERVICES) {
	vcapServices = JSON.parse(process.env.VCAP_SERVICES);
} 
else {
	console.log('VCAP SERVICES was unable to parse');
}

const getUserProvided = function (name) {
	const userProvided = vcapServices['user-provided'].find(element => {
		return element.name === name;
	});
	return userProvided.credentials;
};

/** S3 BUCKET settings */
const middlelayerS3 = vcapServices.s3.find(element => {
	return element.name === 'fs-api-s3';
});

vcapConstants.s3 = {};

if (middlelayerS3.credentials.access_key_id && middlelayerS3.credentials.secret_access_key) {
	vcapConstants.s3.accessKeyId = middlelayerS3.credentials.access_key_id;
	vcapConstants.s3.secretAccessKey = middlelayerS3.credentials.secret_access_key;
}
vcapConstants.s3.REGION = middlelayerS3.credentials.region;
vcapConstants.s3.BUCKET = middlelayerS3.credentials.bucket;

/** jwt secret to generate auth tokens */
const jwt = getUserProvided('auth-service');
vcapConstants.JWT_SECRET_KEY = jwt.JWT_SECRET_KEY; 

/** Connection to FS NRM SUDS settings and initialization of Mock Service */
const SUDS_INFO = getUserProvided('nrm-suds-url-service');

if (SUDS_INFO.SUDS_API_URL === 'MOCKS'){
	SUDS_INFO.SUDS_API_URL = `http://localhost:${process.env.PORT}/mocks`;
	SUDS_INFO.USING_MOCKS = true;
}
else {
	SUDS_INFO.USING_MOCKS = false;
}

const newRelic = getUserProvided('new-relic');
vcapConstants.NEW_RELIC_KEY = newRelic.key;
vcapConstants.NEW_RELIC_APP_NAME = newRelic.app_name;

vcapConstants.SUDS_INFO = SUDS_INFO;

module.exports = vcapConstants;
