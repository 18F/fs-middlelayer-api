[![FS ePermit API](https://img.shields.io/badge/-ePermit-006227.svg?colorA=FFC526&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAACFlBMVEUAAAD%2F%2FyXsvSW8qiXLsCXjuSXyvyX7wiX2wSXqvCXUsyXBrCXvviX%2F%2FyX8yCWUmyVliSV%2FkyV7kSWIlyV0jiWZnSX9yCXNsSXRsiXWtCVWgyVYhCXZtiX%2FyCV8kiV%2BkiX%2FyiX%2FzCWIliWElSX%2FzSX2wiVniSV3kCX2wiXUtCU5eCVujCXWtCW%2FqyXDrSWtpCWwpSWmoiWypiXeuCWJlyWPmSXiuiX%2F1CXsvSXFriW4qSWrpCWElCVdhiWSmiW3qCXCrSXQsiXyvyX%2F1CX%2F%2FyP%2F5yX%2F0iX%2FxCXrvCX%2FxiX%2F0iX%2F5yUcbCU6eCVAeiUfbiVEfCVEfCVZhCVEfCUzdSUtcyVAeyVNfyVZhCVGfSVEfCUqciUSaSUIZCUYayWPmSUUaiUCYiUVaiU1diVjiCUjcCVNfyVFfCXnuyU%2FeiUqciVliSVPgCWQmSUlcCVQgSV7kSX%2FxiWHliVPgCWPmSUtcyWLlyUibyVXgyWzpyX%2FxyXJryUXayVahCWIliWOmCU4eCV2jyXBrCXcuCXMsSVbhSUYaiV1jyU4eCVOgCVujCU6eCUudCWAkyUlcCVEfCVehiVYhCU%2FeiVvjSUSaSUAYiUAYiU1diWAlCUxdSUAYSUBYiUTaSVvjSVqiyVGfSUcbCUQaCUPaCUNZyULZiURaSUYayU6eCVehiVehiV1jyVmiSVOgCVRgSVSgSV2jyVxjSVvjSVMulUvAAAATHRSTlMAAGrao3NYUFdvndVtADfb%2Ffn2%2BP3cOMHAl%2F39lT7v7jsx6eozTPT2UoT%2B%2F4%2FGz%2FL46ut68%2FJ4B1Kau9Pu%2F%2BzQt5NMBgAKGUikQxYIJokgEwAAAFtJREFUCNdjZGBEBiwMvIy2jIcZGRkZrRiPMTIyiFsiJPcxMkgyOsJ4OxhZGFgYOeE6SeMyMuhGI0yew8LAxI3gMqFxGRmMGUthvBZGRgZzFEczMDC4QJlbGRgA3KAIv74V5FUAAAAASUVORK5CYII%3D)](README.md)
[![Code Climate](https://codeclimate.com/github/nci-ats/fs-middlelayer-api/badges/gpa.svg)](https://codeclimate.com/github/nci-ats/fs-middlelayer-api)
[![Code Climate Coverage](https://codeclimate.com/github/nci-ats/fs-middlelayer-api/badges/coverage.svg)](https://codeclimate.com/github/nci-ats/fs-middlelayer-api/coverage)
[![Codecov](https://codecov.io/gh/nci-ats/fs-middlelayer-api/branch/master/graph/badge.svg)](https://codecov.io/gh/nci-ats/fs-middlelayer-api)
[![TravisCI](https://travis-ci.org/nci-ats/fs-middlelayer-api.svg?branch=dev)](https://travis-ci.org/nci-ats/fs-middlelayer-api)
[![bitHound Overall Score](https://www.bithound.io/github/nci-ats/fs-middlelayer-api/badges/score.svg)](https://www.bithound.io/github/nci-ats/fs-middlelayer-api)
[![bitHound Dependencies](https://www.bithound.io/github/nci-ats/fs-middlelayer-api/badges/dependencies.svg)](https://www.bithound.io/github/nci-ats/fs-middlelayer-api/feat%2Fswagger-ui/dependencies/npm)
[![Gemnasium Dependency Status](https://gemnasium.com/badges/github.com/nci-ats/fs-middlelayer-api.svg)](https://gemnasium.com/github.com/nci-ats/fs-middlelayer-api)
[![VersionEye Dependency Status](https://www.versioneye.com/user/projects/58a669e7b4d2a20055fcb84c/badge.svg?style=flat-square)](https://www.versioneye.com/user/projects/58a669e7b4d2a20055fcb84c)
[![GitHub Tags](https://img.shields.io/github/tag/nci-ats/fs-middlelayer-api.svg)](https://github.com/nci-ats/fs-middlelayer-api/tags)
[![GitHub Contributors](https://img.shields.io/github/contributors/nci-ats/fs-middlelayer-api.svg)](https://github.com/nci-ats/fs-middlelayer-api/graphs/contributors)
[![GitHub Issues](https://img.shields.io/github/issues/nci-ats/fs-middlelayer-api.svg)](https://github.com/nci-ats/fs-middlelayer-api/issues)
[![Semver](https://img.shields.io/badge/SemVer-2.0-blue.svg)](http://semver.org/spec/v2.0.0.html)
[![license](https://img.shields.io/badge/license-CC0--1.0-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

# US Forest Service ePermit Middlelayer API

A repository for the development of an API to support the public facing ePermit system to connect to the related Forest Service database, the Special Use Data System (SUDS) located in the National Resource Management System.

This repository is being development under a task order of the Agile Blanket Purchase Agreement.

## Setup

Clone this repo to your desktop and run `npm install` to complete installation.

## How to Test

Run `npm run test`.

## Configuration

1. Create an .env file.
2. Set the contents to `PORT=8080`.

## Dependencies

For information on dependencies, refer to [package.json](https://github.com/nci-ats/fs-middlelayer-api/blob/dev/package.json) and the dependency checkers, especially [Gemnasium](https://gemnasium.com/github.com/nci-ats/fs-middlelayer-api/).

## Contributing

See [CONTRIBUTING](CONTRIBUTING.md) for additional information.

## Public Domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.

## Point of Contact and Notifications
You can report issues and submit questions by opening a new issue in GitHub. You can also receive notifications from GitHub when a new issue is posted, when an existing issue’s status is updated, and when the code repository is updated. To receive these notifications from GitHub, select the Star button near the top of the page.


