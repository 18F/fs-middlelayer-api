# Travis CI

[Travis CI](https://docs.travis-ci.com/) (continuous integration) is configured using the `.travis.yml` file created in the core repository.

Travis is triggered to build with every commit and pull request creation or merge.

The build process includes the following steps:

1. Travis creates a database called `travis_ci_test`. 
2. Travis then runs these four commands:
    1. `npm run dba`
    2. `npm run lint`
    3. `istanbul cover ./node_modules/mocha/bin/_mocha --report lcovonly -- -R spec --recursive`
    4. `codecov`
3. A successful build on a PR merge triggers a branch-dependent deployment to cloud.gov. An `api_key` in `.travis.yml` directs the deployment to `fs-epermit-dev`. 
