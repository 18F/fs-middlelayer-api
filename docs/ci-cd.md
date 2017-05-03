# Travis CI

Travis is configured using the `.travis.yml` file created in the core repository.

Travis CI is configured to build on each commit or on each pull request.

The build process includes the following steps:

1. Travis creates a database called `travis_ci_test`. 
2. Travis then runs these four commands:
    1. `npm run dba`
    2. `npm run lint`
    3. `istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec --recursive`
    4. `codecov`
3. If the build is successful, Travis automatically deploys the build to Heroku. An `api_key` in `.travis.yml` directs the deployment to `fs-epermit-dev`. 
