require('dotenv').config();

const VCAPServices = JSON.parse(process.env.VCAP_SERVICES);
// console.log(VCAPServices)
const S3_INFO = VCAPServices.s3[0].credentials;
let JWT_SECRET_KEY = '';
let SUDS_INFO = {};
for (var service of VCAPServices['user-provided']) {
  if(service.name == 'auth-service'){
    JWT_SECRET_KEY = service.credentials.JWT_SECRET_KEY;
  } else if (service.name == 'nrm-suds-url-service') {
    SUDS_INFO = service.credentials;
  }
}

module.exports.S3_INFO = S3_INFO;
module.exports.JWT_SECRET_KEY = JWT_SECRET_KEY;
module.exports.SUDS_INFO = SUDS_INFO;
