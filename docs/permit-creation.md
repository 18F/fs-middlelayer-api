# Application Creation Process

These steps define the process for creating a new permit type using **Example Permit** for illustration.

1. Create the Swagger Documentation.

	1. Go to `docs/swagger.json` and add the new `GET`, `PUT`, and `POST` route for the new **Example Permit** as shown below:
	
		`/permits/applications/special-uses/commercial/example-permit/`
    
	2. Add the relevant application form fields for these routes. 
	
2. Create a controller.

	1. Go to `controllers/permits/applications/special-uses/commercial`, and create a new controller folder, `example-permit`, within the `commercial` folder.
	
	2. Within the `example-permit` folder, create an `index.js` file.

	3. In the `index.js` file, create functions for the three REST endpoints: `GET`, `POST`, and `PUT`. Refer to [this temp-outfitters permit controller](https://github.com/18F/fs-middlelayer-api/blob/master/controllers/permits/special-uses/commercial/outfitters/index.js) for an example.

3. Create a new route.
	
	1. Go to `routes/permits/applications/special-uses/commercial`, and create a folder for the new permit type, `example-permit`, within the commercial folder.
	
	2. Create an `index.js` file within the new `example-permit` folder to include `GET`, `PUT`, and `POST` routes. These routes will access the respective functions in the controller created in step 2. These routes can be tested for a valid response in the Swagger documentation.
 
4. Create validation.

	1. Go to `controllers/permits/applications/special-uses/validationSchema.json` and create a validation schema section for the new Example Permit.

	2. In the validation schema, define the validation criteria for the application form fields.
	
	3. Go to `controllers/permits/applications/special-uses/validate.js` and update the `validateInput` function according to the new validation schema.

5. Create the `POST` schema.

	1. Go to `controllers/permits/applications/special-uses/postSchema.json` and create the schema that is accepted by the Basic API `POST` request for this new permit.

6. Create the `GET` schema.

	1. Go to `controllers/permits/applications/special-uses/getSchema.json` and create the schema that is accepted by the Basic API `GET` request for this new permit.

7. Update the database, if necessary.

	1. If there are any form fields not supported by the Basic API, they can be saved in the middle-layer API database. To do this, go to `migrations/02-create-applications.js` and update the sequelize migration script as needed.

8. Update the controller.

	1. Update the new `example-permit` controller file to incorporate user input validation, create `GET` and `POST` requests using schemas, make the Basic API call, create application in the middle-layer database, and send back the API response. 
