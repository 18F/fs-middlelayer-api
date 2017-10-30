# Project Performance Standards

The deliverables and performance standards defined in the [QASP](https://github.com/18F/bpa-fs-epermit-api/blob/master/solicitation_documents/QASP.md) for this project are provided in the requirements matrix below.

**Deliverable or Required Services** | **Performance Standard(s)** | **Acceptable Quality Level (AQL)** | **Method of Surveillance**
----------- | ---------------- | -------------- | ---------------
Tested Code | Code delivered under the order must have substantial test code coverage and a clean code base. | Minimum of 90% test coverage of all relevant code | Combination of manual review and automated testing, using agreed-upon publicly-available SaaS products
Accessible | Client-side rendering must conform with section 508 standards. | 0 errors reported for 508 Standards using an automated scanner and 0 errors reported in manual testing | http://squizlabs.github.io/HTML\_CodeSniffer/ or https://github.com/pa11y/pa11y
Deployed | Code must successfully build and deploy into staging environment. | Successful build with a single command | Combination of manual review and automatic testing
Documented | All dependencies (and licenses for dependencies) are listed and all major functions are documented. | All dependencies are listed and the licenses are documented. Software/source code is documented. System diagram is provided. | Combination of manual review and automatic testing
Available | Code must be stored in a version-controlled open-source repository. | All of the code needed to run the front end of the prototype must be available. | 18F will assess code availability.
User research | Usability testing and other user research methods must be conducted at regular intervals throughout the development process (not just at the beginning or end). | Artifacts from usability testing and/or other research methods with end-users are available at the end of every applicable sprint, in accordance with the vendor’s research plan. | 18F will evaluate the artifacts based on a research plan provided by the vendor at the end of the second sprint.
Secure | Code must be free of medium- and high-level static and dynamic security vulnerabilities | Clean tests from a static testing SaaS, such as Gemnasium, and from OWASP ZAP, and/or documentation explaining any false positives. | https://pages.18f.gov/before-you-ship/
