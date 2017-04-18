## Data Store - AWS / S3
To upload files for the temp-outfitters permit, create an S3 bucket in one of the AWS Regions. 

When creating a new application, the application creates a directory with the control number name within the bucket. This directory contains the user-uploaded files. 

These are the properties for AWS S3 data storage:

- `AWS_ACCESS_KEY_ID=<AWS access key ID>`
- `AWS_SECRET_ACCESS_KEY=<AWS secret key>`
- `AWS_REGION=<AWS region>`
- `AWS_BUCKET_NAME=<AWS S3 bucket name>`

If the Node.js server already has a credentials file under the `.aws` directory, the server will use those AWS credentials instead of the environment variables defined on the server.
