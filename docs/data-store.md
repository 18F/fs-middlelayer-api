# Data Store - AWS / S3

To upload files for the temp-outfitters permit, create an S3 bucket in one of the AWS Regions. 

When creating a new application, the application creates a directory with the control number name within the bucket. This directory contains the user-uploaded files. 

## Properties

These are the properties for AWS S3 data storage:

- `AWS_ACCESS_KEY_ID=<AWS access key ID>`
- `AWS_SECRET_ACCESS_KEY=<AWS secret key>`
- `AWS_REGION=<AWS region>`
- `AWS_BUCKET_NAME=<AWS S3 bucket name>`

The Node.js server will look for the AWS properties in the environment variables first. If they are not found, the server will look for the `credentials` file under the `.aws` directory. Refer to [Setting Credentials in Node.js](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) for more information. 
