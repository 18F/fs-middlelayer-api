# Data Store - AWS / S3

To upload files for the temp-outfitters permit, create an S3 bucket in one of the AWS Regions. 

When creating a new application, the application creates a directory with the control number name within the bucket. This directory contains the user-uploaded files. 

## Properties

These are the properties for AWS S3 data storage:

- `AWS_ACCESS_KEY_ID=<AWS access key ID>`
- `AWS_SECRET_ACCESS_KEY=<AWS secret key>`
- `AWS_REGION=<AWS region>`
- `AWS_BUCKET_NAME=<AWS S3 bucket name>`

If you have the configuration defined in the code, the Node.JS server will use that configuration. Otherwise, the server will pull from the `credentials` file under the `.aws` directory.
