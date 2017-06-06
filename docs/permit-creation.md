# Creating a New Permit Type in ePermit API

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

        Intake options include:
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
                    "x-validation":"validation.json#examplePermit",
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
    
    4. The `validation.json` is a schema file for validating submitted data through `POST` routes.</br>
        Example `POST` in `validation.json`:
	   
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
            

          - `fromIntake` indicates whether the field will be directly populated with user input. If set to `false`, the API will populate this field using the strings and fields provided under `madeOf`.

          - `store` describes where this field should be stored, either in the middlelayer DB or in the basic API. It can list multiple places to store this field

          - `madeOf` describes how to auto-populate the field, if fromIntake is false. 
            - `fields` lists the fields, and values which are to be used when auto-populating the field.
                - `fromIntake` indicates whether this piece of the field is from the intake module or not
                    - If `fromIntake` is true, `field` is expected in the same object, specifying the field where this part of the field should come from.
                    - If `fromIntake` is false, `value` is expected in the same object, specifying what value is to be used in this part of the field.
                -`function` describes the function that should be used on an array of all indicies of `fields`, current options are `concat`, `ePermitId`, and `contId`. 
                    - To add an option for this field, create a function in `src/controllers/autoPopulate.js` which takes an array as input and outputs a string. Next export that function at the end of the file like the existing functions. Then update the `buildAutoPopulatedFields` function in `src/controllers/basic.js` by adding a case to the switch/case statement for the name of the newly created function and then a call to that function inside the case statement.

          Files:
          - `maxSize` is measured in megabytes

          Store options include:
          - `middleLayer:<fieldName>`
          - `basic:/application`
          - `basic:/contact/person`
          - `basic:/contact/address`
          - `basic:/contact/phone`

          If the store contains one of the `basic` type options, `basicField` attribute must be included. This is the name of the field used to submit this data to the Basic API.

2. Extend the schema, if necessary.
    1. If there are any new form fields not supported by the current middle-layer database, they can be added in the application table. To do this, create a new migration file (e.g., `06-alter-applications.js`) with the sequelize alter table script and save it under `dba/migrations/`. Also, update `src/models/applications.js` to include the new database fields. Please refer to the [Sequelize migrations documentation](http://docs.sequelizejs.com/en/latest/docs/migrations/) for information on altering an existing table.
    2. If there are routing changes, update `src/controllers/index.js`.
    3. If there are validation changes, update `src/controllers/validation.js` and/or `src/controllers/fileValidation.js` as needed.
    4. If there are any changes on how the files are to be stored, update `src/controllers/store.js`.
    5. If there are any changes on how the requests are made to Basic API, update `src/controllers/basic.js`.
