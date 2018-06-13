# US Forest Service ePermit Middlelayer API

[![FS ePermit API](https://img.shields.io/badge/-ePermit-006227.svg?colorA=FFC526&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAACFlBMVEUAAAD%2F%2FyXsvSW8qiXLsCXjuSXyvyX7wiX2wSXqvCXUsyXBrCXvviX%2F%2FyX8yCWUmyVliSV%2FkyV7kSWIlyV0jiWZnSX9yCXNsSXRsiXWtCVWgyVYhCXZtiX%2FyCV8kiV%2BkiX%2FyiX%2FzCWIliWElSX%2FzSX2wiVniSV3kCX2wiXUtCU5eCVujCXWtCW%2FqyXDrSWtpCWwpSWmoiWypiXeuCWJlyWPmSXiuiX%2F1CXsvSXFriW4qSWrpCWElCVdhiWSmiW3qCXCrSXQsiXyvyX%2F1CX%2F%2FyP%2F5yX%2F0iX%2FxCXrvCX%2FxiX%2F0iX%2F5yUcbCU6eCVAeiUfbiVEfCVEfCVZhCVEfCUzdSUtcyVAeyVNfyVZhCVGfSVEfCUqciUSaSUIZCUYayWPmSUUaiUCYiUVaiU1diVjiCUjcCVNfyVFfCXnuyU%2FeiUqciVliSVPgCWQmSUlcCVQgSV7kSX%2FxiWHliVPgCWPmSUtcyWLlyUibyVXgyWzpyX%2FxyXJryUXayVahCWIliWOmCU4eCV2jyXBrCXcuCXMsSVbhSUYaiV1jyU4eCVOgCVujCU6eCUudCWAkyUlcCVEfCVehiVYhCU%2FeiVvjSUSaSUAYiUAYiU1diWAlCUxdSUAYSUBYiUTaSVvjSVqiyVGfSUcbCUQaCUPaCUNZyULZiURaSUYayU6eCVehiVehiV1jyVmiSVOgCVRgSVSgSV2jyVxjSVvjSVMulUvAAAATHRSTlMAAGrao3NYUFdvndVtADfb%2Ffn2%2BP3cOMHAl%2F39lT7v7jsx6eozTPT2UoT%2B%2F4%2FGz%2FL46ut68%2FJ4B1Kau9Pu%2F%2BzQt5NMBgAKGUikQxYIJokgEwAAAFtJREFUCNdjZGBEBiwMvIy2jIcZGRkZrRiPMTIyiFsiJPcxMkgyOsJ4OxhZGFgYOeE6SeMyMuhGI0yew8LAxI3gMqFxGRmMGUthvBZGRgZzFEczMDC4QJlbGRgA3KAIv74V5FUAAAAASUVORK5CYII%3D)](README.md)
[![TravisCI](https://travis-ci.org/nci-ats/fs-middlelayer-api.svg?branch=dev)](https://travis-ci.org/nci-ats/fs-middlelayer-api)
[![Code Climate](https://codeclimate.com/github/nci-ats/fs-middlelayer-api/badges/gpa.svg)](https://codeclimate.com/github/nci-ats/fs-middlelayer-api)
[![Code Climate Coverage](https://codeclimate.com/github/nci-ats/fs-middlelayer-api/badges/coverage.svg)](https://codeclimate.com/github/nci-ats/fs-middlelayer-api/coverage)
[![Codecov](https://codecov.io/gh/nci-ats/fs-middlelayer-api/branch/master/graph/badge.svg)](https://codecov.io/gh/nci-ats/fs-middlelayer-api)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a9f9ba4bc12a44d4bcf5f40084f72b9d)](https://www.codacy.com/app/nci-ats/fs-middlelayer-api)
[![bitHound Overall Score](https://www.bithound.io/github/nci-ats/fs-middlelayer-api/badges/score.svg)](https://www.bithound.io/github/nci-ats/fs-middlelayer-api)
[![bitHound Dependencies](https://www.bithound.io/github/nci-ats/fs-middlelayer-api/badges/dependencies.svg)](https://www.bithound.io/github/nci-ats/fs-middlelayer-api/feat%2Fswagger-ui/dependencies/npm)
[![Gemnasium Dependency Status](https://gemnasium.com/badges/github.com/nci-ats/fs-middlelayer-api.svg)](https://gemnasium.com/github.com/nci-ats/fs-middlelayer-api)
[![VersionEye Dependency Status](https://www.versioneye.com/user/projects/58a669e7b4d2a20055fcb84c/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58a669e7b4d2a20055fcb84c)
[![GitHub Tags](https://img.shields.io/github/tag/nci-ats/fs-middlelayer-api.svg)](https://github.com/nci-ats/fs-middlelayer-api/tags)
[![GitHub Contributors](https://img.shields.io/github/contributors/nci-ats/fs-middlelayer-api.svg)](https://github.com/nci-ats/fs-middlelayer-api/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/nci-ats/fs-middlelayer-api.svg)](https://github.com/nci-ats/fs-middlelayer-api/issues)
[![Semver](https://img.shields.io/badge/SemVer-2.0-blue.svg)](http://semver.org/spec/v2.0.0.html)
[![license](https://img.shields.io/badge/license-CC0--1.0-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/)
[![Known Vulnerabilities](https://snyk.io/test/github/18f/fs-middlelayer-api/badge.svg)](https://snyk.io/test/github/18f/fs-middlelayer-api)

A repository for the development of an API to support the public facing ePermit system to connect to the related Forest Service database, the Special Use Data System (SUDS) located in the National Resource Management System.

This repository was partially developed under a task order of the Agile Blanket Purchase Agreement.

## Table of Contents

- [Local Development](#local-development)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Creating a new permit type](#creating-a-new-permit-type)
- [Authentication](#authentication-process)
- [Environment Variables](#environment-variables)
- [Continuous integration and deployment](#continuous-integration-and-deployment)
- [Code quality and coverage](#code-quality-and-coverage)
- [File storage - AWS / S3](#file-storage---aws--s3)
- [Database and ORM](#database-and-orm)
- [Schema spec](#schema-spec)
- [Automated tests](#automated-tests)
- [Field validation](#field-validation)
- [Alert Monitoring](#alert-monitoring)

## Local Development

1. Clone or download this repository.
2. Run `npm install` to install application and all dependencies.
3. Set the [environment variables](#environment-variables)
4. Setup a database and run `npm run dba`.
5. [Create a test user](#create-a-user).
6. Run `npm run watch` to start Node.js server.

## Dependencies

Refer to application package and dependency trackers for additional dependency information:

- Infrastructure:
  - Runtime: Node.js >= 6.9.x
  - Engine: NPM >= 3.10.x
  - Database: PostgreSQL >= 9.4.x
  - Storage: AWS S3
- Application package:
  - [package.json](https://github.com/nci-ats/fs-middlelayer-api/blob/dev/package.json)
  - [npm-shrinkwrap.json](https://github.com/nci-ats/fs-middlelayer-api/blob/dev/npm-shrinkwrap.json)
- Dependency trackers:
  - [Gemnasium](https://gemnasium.com/github.com/nci-ats/fs-middlelayer-api/)
  - [VersionEye](https://www.versioneye.com/user/projects/58a669e7b4d2a20055fcb84c)
  - [Bithound](https://www.bithound.io/github/nci-ats/fs-middlelayer-api/feat%2Fswagger-ui/dependencies/npm)

The [Moxai package](https://www.npmjs.com/package/moxai) is a dependency for testing and was built specifically for this project. Moxai was published as an independent package that can be used with any Express application. This application uses the moxai package as a placeholder mock API. The [/mocks/basic.json file](mocks/basic.json) maintains the API endpoint schema.

It is known that the [api.json](src/api.json) file is not strictly valid per the OpenAPI Specification. If this is checked against a validator it will report that it is invalid. We are allowing this to stay invalid because we felt it would be more valuable for developers to have an example data model for permits, rather than have every part of the specification be valid.

## Creating a new permit type

These steps define the process for creating a new permit type using Example Permit.

1. Create Swagger Documentation.
    1. Go to the `src/api.json` Swagger document file and add the new `GET`, `PUT`, and `POST` route for the new Example Permit as shown below:

        `/permits/applications/special-uses/commercial/example-permit/`

    2. Create the GET endpoint for the new permit with the relevant application form fields in the Swagger document. </br>
        Example `GET` in `api.json`:

            /permits/applications/special-uses/commercial/example-permit{controlNumber}/: {
                "get": {
                    "getTemplate":{
                        "controlNumber":{"default":"", "intake":"accinstCn"},
                        "region": {"default":"", "intake":"middleLayer/region"},
                        "forest": {"default":"", "intake":"middleLayer/forest"},
                        "applicantInfo": {
                            "contactControlNumber":{"default":"", "intake":"addresses/contCn"},
                            "firstName": {"default":"", "intake":"holders/firstName"},
                        }
                    }
                }
            }

        `Intake` is a term for the origin of the field. Acceptable options for `intake`:
        - `middleLayer/<fieldName>`
          - From the application table in middleLayer database, column name `<fieldName>`
        - `addresses/<fieldName>`
          - From Basic API response JSON; using the first element of the `addresses` array, `<fieldName>` is the key of the key value pair
        - `holders/<fieldName>`
          - From Basic API response JSON; using the first element of the `holders` array, `<fieldName>` is the key of the key value pair
        - `phones/<fieldName>`
          - From Basic API response JSON; using the first element of the `phones` array, `<fieldName>` is the key of the key value pair
        - `<fieldName>`
          - From Basic API response, not in any array


    3. Create the POST endpoint for the new permit with the relevant application form fields. </br>
        Example `POST` in `api.json`:

            "/permits/applications/special-uses/commercial/example-permit/": {
                "post": {
                    "x-validation":"translate.json#examplePermit",
                    "parameters": [          
                        {
                            "in": "formData",
                            "name": "body",
                            "description": "example permit information",
                            "required": true,
                            "schema": {
                                "$ref": "#/definitions/examplePermit"
                            }
                        },
                        {
                            "in": "formData",
                            "name": "exampleDocumentation",
                            "description": "example file upload",
                            "type": "file"
                        }
                    ]
                }
                "examplePermit": {
                    "type": "object",
                    "properties": {
                        "region": { "type" : "string" },
                        "forest": { "type" : "string" },
                        "district": { "type" : "string" }
                        ...
                    },
                    "required": ["region","forest","district"...]
                }

    4. The `translate.json` is a schema file for validating submitted data through `POST` routes.</br>
        Example `POST` in `translate.json`:

                "district": {
                    "default":"",
                    "fromIntake":true,
                    "pattern":"^[0-9]{2}$",
                    "basicStore":true,
                    "type" : "string"
                },
                "firstName": {
                    "basicField":"firstName",
                    "default":"",
                    "fromIntake":true,
                    "maxLength":255,
                    "basicStore":["/contact/person"],
                    "type": "string"
                },
                "securityId":{
                    "basicField":"securityId",
                    "default":"",
                    "fromIntake":false,
                    "madeOf":{
                        "fields":[
                            {
                                "fromIntake":true,
                                "field":"region"
                            },
                            {
                                "fromIntake":true,
                                "field":"forest"
                            },
                            {
                                "fromIntake":false,
                                "value":"123"
                            }
                        ],
                        "function":"concat"
                    },
                    "basicStore":["/application", "/contact/address", "/contact/phone"],
                    "type" : "string"
                },
                "exampleDocumentation": {
                    "filetypecode":"exd",
                    "maxSize": 25,
                    "requiredFile":false,
                    "localStore":["exampleDocumentation"],
                    "type": "file",
                    "validExtensions":[
                        "pdf",
                        "doc",
                        "docx",
                        "rtf"
                    ]
                },


          - `fromIntake {Boolean} default:true`: indicates whether the field will be directly populated with user input. If set to `false`, the API will populate this field using the strings and fields provided under `madeOf`.

          - `basicStore {Boolean} default:false` describes which endpoints in the basic api, the fields will be sent to. Endpoint options include:
              - `/application`
              - `/contact/person`
              - `/contact/address`
              - `/contact/phone`

          - `localStore {Boolean} default:false` whether to store the field in the database.

          - `madeOf` describes how to auto-populate the field, if fromIntake is false.
              - `fields` lists the fields, and values which are to be used when auto-populating the field.
                  - `fromIntake` indicates whether this piece of the field is from the intake module or not
                      - If `fromIntake` is true, `field` is expected in the same object, specifying the field where this part of the field should come from.
                      - If `fromIntake` is false, `value` is expected in the same object, specifying what value is to be used in this part of the field.
                  -`function` describes the function that should be used on an array of all indicies of `fields`, current options are `concat`, `ePermitId`, and `contId`.
                      - To add an option for this field, create a function in `src/controllers/autoPopulate.js` which takes an array as input and outputs a string. Next export that function at the end of the file like the existing functions. Then update the `buildAutoPopulatedFields` function in `src/controllers/basic.js` by adding a case to the switch/case statement for the name of the newly created function and then a call to that function inside the case statement.

          Files:
          - `maxSize` is measured in megabytes

          If the store contains one of the `basic` type options, `basicField` attribute must be included. This is the name of the field used to submit this data to the Basic API.

2. Extend the schema, if necessary.
    1. If there are any new form fields not supported by the current middle-layer database, they can be added in the application table. To do this, create a new migration file (e.g., `06-alter-applications.js`) with the sequelize alter table script and save it under `dba/migrations/`. Also, update `src/models/applications.js` to include the new database fields. Please refer to the [Sequelize migrations documentation](http://docs.sequelizejs.com/en/latest/docs/migrations/) for information on altering an existing table.
    2. If there are routing changes, update `src/controllers/index.js`.
    3. If there are validation changes, update `src/controllers/validation.js` and/or `src/controllers/fileValidation.js` as needed.
    4. If there are any changes on how the files are to be stored, update `src/controllers/store.js`.
    5. If there are any changes on how the requests are made to Basic API, update `src/controllers/sudsconnection` directory.

## Authentication process

When a user enters a username and password in the `/auth` route, that information is verified against the `Users` table in the middle-layer database. This table contains the usernames and their encrypted password.

Once the user is authenticated, the application sends back a jwt token that can be used for any of the API routes. The token is valid for two hours. Note that only userrole ‘admin’ has permission to access all routes; userrole ‘user’ does not currently have permission to access any routes.

A separate route, `/auth`, generates token. This token-based authentication is handled using four `npm` modules:

- `Passport`, the authentication middleware
- `passport-local`
- `bcrypt-nodejs`
- `jsonwebtoken`

This API uses the `passport-local` strategy. This strategy authenticates users with a username and password and verifies that information against the database. When the user enters a username and password, the `bcrypt-nodejs` module verifies the submitted password against the hash in the database. Upon successful authentication, the application sends back a token using the `jsonwebtoken` module. The `jsonwebtoken` module uses a secret key, stored as an environment variable, to generate the token, which is set to be valid for 120 minutes.

### Create a user

To create an API user account, run `node cmd/createUser.js -u <username> -p <password> -r <userrole>`. The user role is either 'user' or 'admin'. The ‘admin’ role has permission to access all routes, but the ‘user’ role does not currently have permission to access any routes.

## Continuous integration and deployment

This repo currently uses Circle CI for automated tests and deployment.

Circle is triggered to build with every commit and pull request creation or merge.

The build process includes the following steps:

1. The CI creates a database to test against.
2. Then runs these four commands:
    1. `npm run dba`
    2. `npm run lint`
    3. `istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec --recursive`
    4. `codecov`
3. A successful build on a PR merge triggers a branch-dependent deployment to cloud.gov using the `cg-deploy/deploy.sh` and the accompanying manifests.

## Code Quality and Coverage

We are using the following packages for maintaining code quality and coverage.

### Code Quality

#### ESLint

[ESLint](https://www.npmjs.com/package/eslint) is a pluggable linting utility for JavaScript. The linting configuration and rules are provided in the `.eslintrc.json` file. Use `npm run lint` to run ESLint.

#### MarkdownLint

[MarkdownLint](https://www.npmjs.com/package/markdownlint) is a static analysis tool with a library of rules to enforce standards and consistency for Markdown files.
The linting configuration and rules are provided in the `.markdownlint.json` file.
Use `npm run lint:md` to run MarkdownLint.

#### JSDoc

[JSDoc](https://www.npmjs.com/package/jsdoc) is an API documentation generator for JavaScript.
JSDoc documentation is available in the `/docs/code` folder and accessed via `<application-URL>/docs/code`. Use `npm run doc` to run JSDoc.

### Code Coverage

#### Codecov

We use [Istanbul](https://www.npmjs.com/package/istanbul) to run the Mocha test cases. [Codecov](https://www.npmjs.com/package/codecov) makes the Instanbul test coverage report available to Travis CI.
Using `npm run coverage` runs the `istanbul cover ./node_modules/mocha/bin/_mocha -- --recursive` command. This command runs the tests and creates the report in `/coverage`. The coverage indicates the percentage of code covered by unit testing.

#### Code Climate

[Code Climate](https://www.npmjs.com/package/codeclimate) is another tool for generating [unit test coverage reports](https://codeclimate.com/github/nci-ats/fs-middlelayer-api/code). Code Climate is configured in the `.codecov.yml` file.

## File storage - AWS / S3

To upload files for permits that require additional files, create an S3 bucket in one of the AWS Regions.

When creating a new application, the application creates a directory with the control number name within the bucket. This directory contains the user-uploaded files.

### Properties

These are the properties for AWS S3 data storage, which is a bound service created through cloud.gov. These env vars are set in the VCAP services.

- `AWS_ACCESS_KEY_ID=<AWS access key ID>`
- `AWS_SECRET_ACCESS_KEY=<AWS secret key>`
- `AWS_REGION=<AWS region>`
- `AWS_BUCKET_NAME=<AWS S3 bucket name>`

## Environment Variables

These are the environment variables that must be created on the Node.js server for the application to run:

### Required for Production and Testing

- `DATABASE_URL=postgres://<username>:<password>@<database hostname>:5432<database name>`
- `JWT_SECRET_KEY=<secret key to generate tokens>`
- `VCAP_SERVICES=an object to replicate the bound services of the SUDS_API_URL and the S3 bucket`

### CI Environment variables

Additional environment variable for Circle: SNYK_TOKEN
   
### Creating API User Accounts Using Environment Variables

User accounts will be created only if these variable are present:

- `ADMINROLE_USER=<admin role account username>`
- `ADMINROLE_HASH=<admin role account password’s hash generated by bcrypt>`
- `USERROLE_USER=<user role account username>`
- `USERROLE_HASH=<user role account password’s hash generated by bcrypt>`

### Setting Environment Variables

The [dotenv](https://www.npmjs.com/package/dotenv) npm package is used to load environment variables to the application for local development.from a .env file into process.env

`Example: PORT=8080`

### Setting AWS Credentials

The Node.js server will look for the AWS properties in the system's environment variables first. If they are not found, the server will look for the credentials file under the `.aws` directory. Refer to [Setting Credentials in Node.js](http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/setting-credentials-node.html) for more information.

## Database and ORM

The middle-layer database stores application fields that are not supported by the SUDS database. The middle-layer API uses Sequelize, a promise-based Node.js ORM, to access the middle-layer database. For more information, refer to the [Sequelize documentation](http://docs.sequelizejs.com/en/v3/).

Database migrations and filetypes can be populated using the `npm run dba` command.

### Models

Models are a JavaScript factory class that represents a table in the database. Models are located under `/src/models`.

## Schema spec

The json schema was extended for this project. See the [schema extension here](/docs/spec.json).

## Automated tests

The `npm test` command during the build process invokes all test cases included in the code. Those test cases are for both API testing and unit testing.

We use the [Mocha testing framework](https://www.npmjs.com/package/mocha) with the [Chai assertion library](https://www.npmjs.com/package/chai) along with [SuperTest](https://www.npmjs.com/package/supertest), an HTTP AJAX request library, for testing API endpoint responses.

### Overview

- Scripts
  - Use `npm test` to run Mocha unit tests.
  - Use `npm run coverage` for Istanbul code coverage. *Results in /coverage folder.*
  - Use `npm run lint` for ESLint static code analysis. *Results in /lint folder.*
  - Use `npm run fix` for ESLint code fix.
  - Use `npm run dba` to run Sequelize migration and seeder.
  - Use `npm run doc` to run [JSDoc](http://usejsdoc.org/) code documentation. *Results in `/docs/code` folder and accessed via `<application-URL>/docs/code`.*
- Data
  - Files: Test files are stored in [test/data](test/data) directory

### Unit testing

Unit testing tests a particular javascript function (e.g., checking a phone number).
These two files contain unit testing test cases:

- `test/controllers-test.js`
- `test/functions-test.js`

### API tests (Integration Tests)

API tests run the test case against the API routes.

These three files contain the API testing test cases:

- `test/authentication.js`
- `test/noncommercial.js`
- `test/outfitters.js`

### Functional testing

Functional testing is managed through [HipTest](https://hiptest.net/). [Manual testing scenarios](docs/testing_scenarios.xlsx) walk testers through a series of steps to verify that the application functions as expected. Each test maps to acceptance criteria for a corresponding user story. Testers can execute multiple runs for a given set of scenarios, and HipTest keeps a record of all test run results.

## Field validation

### Updating state abbreviations

In [translate.json](../src/controllers/translate.json), in the `applicantInfoBase` schema under `mailingState`, there is a field called `pattern`.

#### Adding a state

Given the pattern `^(A[EZ]|C[AOT]|D[E])$`:

To add a state code AQ, update the pattern to `^(A[EZQ]|C[AOT]|D[E])$`.

To add a state code ZQ, update the pattern to `^(A[EZ]|C[AOT]|D[E]|Z[Q])$`.

#### Removing a state

Given the pattern `^(A[EZ]|C[AOT]|D[E]|Z[Q])$`:

To remove a state code AE, update the pattern to `^(A[Z]|C[AOT]|D[E]|Z[Q])$`.

To remove a state code ZQ, update the pattern to `^(A[EZ]|C[AOT]|D[E])$`.

### Adding field validations

#### Adding validation for required field

Under the properties field, add a field by adding the following, replacing `fieldName` with the name of the field to be added:
`"fieldName": { "type": "fieldType" }`. Then add the name of the field to the required array, located after the properties object.

This will automatically generate an error if the required field is not provided.

#### Adding validation for required field type

Using the above example `"fieldName": { "type": "fieldType" }`:

Specify the field's required types by updating `fieldType` to the type `fieldName` should be. Fields can have multiple types by providing an array with the types `fieldName` can be.

This will automatically generate an error if the required type is not provided.

#### Adding validation for field format

Using the example `"fieldName": { "type": "fieldType" }`:

Add format validation by adding a format field to the fieldName object: `"fieldName": { "type": "fieldType", "format": "fieldFormat1" }`.

The format field points to the name of a function, provided to the validation package, which will be used to validate whether the field is valid or not.

In addition to adding the function name to the schema, the function must be created. It must take input in and return a Boolean.

Once the function has been created, it must be provided in the validation package. In [validation.js](../src/controllers/validation.js), inside the `validateBody` function, add `v.customFormats.fieldFormat1 = fieldFormat2;` where `fieldFormat1` is the name of the function defined to return a Boolean and `fieldFormat2` is the format used in the schema. `fieldFormat1` and `fieldFormat2` can have the same name.

##### Adding error for field format

When adding error text to [patternErrorMesssages.json](../src/controllers/patternErrorMessages.json), the key is the name of the field the format is applied to, and the value is the error message that should be returned. In the above example, the new key/value pair would be `"fieldName": "must do something"`. This will return "fieldName must do something" if the format validation fails.

#### Adding validation for field regex pattern

Using the example `"fieldName": { "type": "fieldType" }`:

Add pattern validation by adding a pattern field to the fieldName object: `"fieldName": { "type": "fieldType", "pattern": "^[a-z]{6}$" }`.

##### Adding error for field regex pattern

When adding error text to [patternErrorMesssages.json](../src/controllers/patternErrorMessages.json), the key is the name of the field the pattern is applied to, and the value is the error message that should be returned. In the above example, the new key/value pair would be `"fieldName": "must do something"`. This will return "fieldName must do something" if the pattern validation fails.

#### Adding validation for field dependency

Using the example `"properties:{`
`fieldName": { "type": "fieldType" },`
`fieldName2: { "type": "fieldType2" }`
`}`:

Add dependencies by adding a dependencies field after properties.

`"properties:{`
`fieldName": { "type": "fieldType" },`
`fieldName2: { "type": "fieldType2" }`
`},`
`"dependencies:{"`
`"fieldName":["fieldName2"]`
`}`

The above code will require `fieldName2` if `fieldName` is present.

##### Adding error for field dependency

No extra steps needed.

## Alert Monitoring
This project uses New Relic Monitoring for performance and uptime alerts. The application name and license keys are provided as environment variables that are accessed through the VCAP constants. This application uses the `newrelic` npm module.

### Logs
This application uses Winston library to format logs as JSON to the [cloud.gov Kibana](https://logs.fr.cloud.gov/) instance. The centralized logger is within the `src/services/utility.js` as the `logger` property. For route requests, the [expressWinston](https://www.npmjs.com/package/express-winston) library is used. For server controller actions the `src/services/utility.js:logControllerAction` should be used.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Public Domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
