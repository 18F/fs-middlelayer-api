export BUCKET=`echo "${LOG_S3}" | jq -r .bucket`
export AWS_ACCESS_KEY_ID=`echo "${LOG_S3}" | jq -r .access_key_id`
export AWS_SECRET_ACCESS_KEY=`echo "${LOG_S3}" | jq -r .secret_access_key`
export AWS_DEFAULT_REGION=`echo "${LOG_S3}" | jq -r .region`
aws s3 cp snyk s3://"${LOG_S3}" --recursive