## Creating a New Permit Type in ePermit API

These steps define the process for creating a new permit type using Example Permit.

1. Create Swagger Documentation.
    1. Go to `src/api.json` and add the new `GET`, `PUT`, and `POST` route for the new Example Permit as shown below:

        `/permits/applications/special-uses/commercial/example-permit/`

    2. Add the relevant application form fields for these routes. </br>
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
                          ...

        Intake options include:
        - `middleLayer/<fieldName>`
          - From the application table in middleLayer database, column name <fieldName>
        - `addresses/<fieldName>`
          - From Basic API response, addresses array
        - `holders/<fieldName>`
          - From Basic API response, holders array
        - `phones/<fieldName>`
          - From Basic API response, phones array
        - `<fieldName>`
          - From Basic API response, not in any array


    3. Example `POST` in `api.json`:

               "/permits/applications/special-uses/commercial/example-permit/": {
                  "post": {
                    "x-validation":{
                                "$ref":"validation.json#examplePermit"
                            },
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
                  ....
                },
                "required": ["region","forest","district"...]
                }
    
      4. Example `POST` in `validation.json`:
	   
                "district": {
                                "default":"",
                                "fromIntake":true,
                                "pattern":"^[0-9]{2}$",
                                "store":["middleLayer:district"],
                                "type" : "string"
                            },
                "firstName": {
                               "basicField":"firstName",
                               "default":"",
                               "fromIntake":true,
                               "maxLength":255,
                               "store":["basic:/contact/person"],
                               "type": "string"
                            },
                "securityId":{
                                "basicField":"securityId",
                                "default":"",
                                "fromIntake":false,
                                "madeOf":["region","forest","district"],
                                "store":["basic:/application", "basic:/contact/address", "basic:/contact/phone"],
                                "type" : "string"
                            },
                "exampleDocumentation": {
                                "filetypecode":"exd",
                                "maxSize": 25,
                                "requiredFile":false,
                                "store":["middleLayer:exampleDocumentation"],
                                "type": "file",
                                "validExtensions":[
                                    "pdf",
                                    "doc",
                                    "docx",
                                    "rtf"
                                ]
                            },
            

          - `fromIntake` indicates whether the field will be directly populated with user input. If set to `false`, `madeOf` must be provided, giving the fields, or strings used to populate this field.

          Files:
          - `maxSize` is measured in megabytes

          Store options include:
          - `middleLayer:<fieldName>`
          - `basic:/application`
          - `basic:/contact/person`
          - `basic:/contact/address`
          - `basic:/contact/phone`

          If the store contains one of the `basic` type options, `basicField` attribute must be included. This is the name of the field used to submit this data to the basic API.

2. Extend schema, if necessary.
    1. If there are any new form fields not supported by the current middle-layer  database, they can be added in the application table. To do this, go to `dba/migrations/ 02-create-applications.js` and update the sequelize migration script as needed. Also, update `src/models/applications.js` to include the new database fields.
    2. If there are routing changes, update `src/controllers/index.js`.
    3. If there are validation changes, update `src/controllers/validation.js`.
    4. If there are any changes on how the files are to be stored, update `src/controllers/store.js`.
    5. If there are any changes on how the requests are made to Basic API, update `src/controllers/basic.js`.
