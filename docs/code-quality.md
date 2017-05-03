# Code Quality and Coverage

We are using the following packages for maintaining code quality and coverage.

## Code Quality

### ESLint

[ESLint](https://www.npmjs.com/package/eslint) is a pluggable linting utility for JavaScript. The linting configuration and rules are provided in the .eslintrc.json file. Use `npm run lint` to run ESLint.

### MarkdownLint

[MarkdownLint](https://www.npmjs.com/package/markdownlint) is a static analysis tool with a library of rules to enforce standards and consistency for Markdown files.
The linting configuration and rules are provided in the .markdownlint.json file.
Use `npm run lint:md` to run MarkdownLint.

###  JSDoc

[JSDoc](https://www.npmjs.com/package/jsdoc) is an API documentation generator for JavaScript.
JSDoc documentation is available in the `/docs/code` folder and accessed via `<application-URL>/docs/code`. Use `npm run doc` to run JSDoc.

## Code Coverage

###  Codecov 

We use [Istanbul](https://www.npmjs.com/package/istanbul) to run the Mocha test cases. [Codecov](https://www.npmjs.com/package/codecov) makes the Instanbul test coverage report available to Travis CI.
Using `npm run coverage` runs the `istanbul cover ./node_modules/mocha/bin/_mocha -- --recursive` command. This command runs the tests and creates the report in /coverage. The coverage indicates the percentage of code covered by unit testing.

### Code Climate

[Code Climate](https://www.npmjs.com/package/codeclimate) is another tool for generating [unit test coverage reports](https://codeclimate.com/github/nci-ats/fs-middlelayer-api/code). Code Climate is configured in the `.codecov.yml file`.
