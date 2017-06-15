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

# US Forest Service ePermit Middlelayer API

A repository for the development of an API to support the public facing ePermit system to connect to the related Forest Service database, the Special Use Data System (SUDS) located in the National Resource Management System.

This repository is being developed under a task order of the Agile Blanket Purchase Agreement.

## Setup

1. Clone or download this repository.
2. Run `npm install` to install application and all dependencies.
3. Run `npm start` to start Node.js server.

## Configuration

- Environment variables:
  - PORT | Default: 8000
  - DATABASE_URL | Format: postgres://user:password@host:port/database
  - AWS_ACCESS_KEY_ID
  - AWS_SECRET_ACCESS_KEY
  - AWS_REGION
  - AWS_BUCKET_NAME
  - SUDS_API_URL
    - To use the moxai dependency and point at the mock API, update this to be `http://localhost:${PORT}/mocks`.

- API user account:
  - To create an API user account, run `node cmd/createUser.js -u <username> -p <password> -r <userrole>`. The user role is either 'user' or 'admin'. The ‘admin’ role has permission to access all routes, but the ‘user’ role does not currently have permission to access any routes.

- Dotenv:
  - [Dotenv](https://www.npmjs.com/package/dotenv) is used which can load environment variables from a .env file into process.env
  - Example: PORT=8080

## How to Test

- Scripts
  - Use `npm test` to run Mocha unit tests.
  - Use `npm run coverage` for Istanbul code coverage. *Results in /coverage folder.*
  - Use `npm run lint` for ESLint static code analysis. *Results in /lint folder.*
  - Use `npm run fix` for ESLint code fix.
  - Use `npm run dba` to run Sequelize migration and seeder.
  - Use `npm run doc` to run [JSDoc](http://usejsdoc.org/) code documentation. *Results in `/docs/code` folder and accessed via `<application-URL>/docs/code`.*
- Data
  - Files: Test files are stored in [test/data](test/data) directory

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

## Point of Contact and Notifications

You can report issues and submit questions by opening a new [Issue](https://help.github.com/articles/creating-an-issue/) in GitHub. You can [Watch](https://help.github.com/articles/watching-repositories/) this repo to receive notifications from GitHub when a new issue is posted, when an existing issue’s status is updated, and when a pull request is created.

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Public Domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
