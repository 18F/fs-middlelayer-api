let VCAPServices = {};
try {
	VCAPServices = JSON.parse(process.env.VCAP_SERVICES);
}
catch (err){
	console.log(`VCAP SERVICES PARSE recieved the following error: ${err}`);
}

//Env Variables bound to the app through cloud foundry services
//S3 bucket assignment
let S3_INFO = {};
if (Array.isArray(VCAPServices.s3) && VCAPServices.s3.length > 0){
	S3_INFO = VCAPServices.s3[0].credentials;
}

//User provided services
let JWT_SECRET_KEY = '';
let SUDS_INFO = {};
for (const service of VCAPServices['user-provided']) {
	if (service.name === 'auth-service'){
		JWT_SECRET_KEY = service.credentials.JWT_SECRET_KEY;
	}
	else if (service.name === 'nrm-suds-url-service') {
		SUDS_INFO = service.credentials;
	}
}

//Handle using mocks
if (SUDS_INFO.SUDS_API_URL === 'MOCKS'){
	SUDS_INFO.SUDS_API_URL = `http://localhost:${process.env.PORT}/mocks`;
	SUDS_INFO.USING_MOCKS = true;
}
else {
	SUDS_INFO.USING_MOCKS = false;
}

module.exports.S3_INFO = S3_INFO;
module.exports.JWT_SECRET_KEY = JWT_SECRET_KEY;
module.exports.SUDS_INFO = SUDS_INFO;
