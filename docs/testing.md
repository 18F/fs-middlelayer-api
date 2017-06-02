# Testing 

The `npm test` command during the build process invokes all test cases included in the code. Those test cases are for both API testing and unit testing.

We use the [Mocha testing framework](https://www.npmjs.com/package/mocha) with the [Chai assertion library](https://www.npmjs.com/package/chai) along with [SuperTest](https://www.npmjs.com/package/supertest), an HTTP AJAX request library, for testing API endpoint responses.

## Unit Testing

Unit testing tests a particular javascript function (e.g., checking a phone number).
These two files contain unit testing test cases:
- `test/controllers-test.js`
- `test/functions-test.js`

## API Tests (Integration Tests)

API tests run the test case against the API routes.

These three files contain the API testing test cases:
- `test/authentication.js`
- `test/noncommercial.js`
- `test/outfitters.js`

## Functional Testing

Functional testing is managed through [HipTest](https://hiptest.net/). [Manual testing scenarios](testing_scenarios.xlsx) walk testers through a series of steps to verify that the application functions as expected. Each test maps to acceptance criteria for a corresponding user story. Testers can execute multiple runs for a given set of scenarios, and HipTest keeps a record of all test run results.  
