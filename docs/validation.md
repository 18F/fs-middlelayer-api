# Validation

## Updating State Abbreviations

In [validation.json](../src/controllers/validation.json), in the `applicantInfoBase` schema under `mailingState`, there is a field called `pattern`.

### Adding a state

Given the pattern `^(A[EZ]|C[AOT]|D[E])$`:

To add a state code AQ, update the pattern to `^(A[EZQ]|C[AOT]|D[E])$`.

To add a state code ZQ, update the pattern to `^(A[EZ]|C[AOT]|D[E]|Z[Q])$`.

### Removing a state

Given the pattern `^(A[EZ]|C[AOT]|D[E]|Z[Q])$`:

To remove a state code AE, update the pattern to `^(A[Z]|C[AOT]|D[E]|Z[Q])$`.

To remove a state code ZQ, update the pattern to `^(A[EZ]|C[AOT]|D[E])$`.

## Adding field validations

### Adding validation for required field

Under the properties field, add a field by adding the following, replacing `fieldName` with the name of the field to be added:
`"fieldName": { "type": "fieldType" }`. Then add the name of the field to the required array, located after the properties object.

#### Adding error for required field

No extra steps needed.

### Adding validation for required field type

Using the above example `"fieldName": { "type": "fieldType" }`:

Specify the field's required types by updating `fieldType` to the type `fieldName` should be. Fields can have multiple types by providing an array with the types `fieldName` can be.

#### Adding error for required type

No extra steps needed.

### Adding validation for field format

Using the example `"fieldName": { "type": "fieldType" }`:

Add format validation by adding a format field to the fieldName object: `"fieldName": { "type": "fieldType", "format": "fieldFormat1" }`.

The format field points to the name of a function, provided to the validation package, which will be used to validate whether the field is valid or not.

In addition to adding the function name to the schema, the function must be created. It must take input in and return a Boolean. 

Once the function has been created, it must be provided in the validation package. In [validation.js](../src/controllers/validation.js), inside the `validateBody` function, add `v.customFormats.fieldFormat1 = fieldFormat2;` where `fieldFormat1` is the name of the function defined to return a Boolean and `fieldFormat2` is the format used in the schema. `fieldFormat1` and `fieldFormat2` can have the same name.

#### Adding error for field format

When adding error text to [patternErrorMesssages.json](../src/controllers/patternErrorMessages.json), the key is the name of the field the format is applied to, and the value is the error message that should be returned. In the above example, the new key/value pair would be `"fieldName": "must do something"`. This will return "fieldName must do something" if the format validation fails.

### Adding validation for field regex pattern

Using the example `"fieldName": { "type": "fieldType" }`:

Add pattern validation by adding a pattern field to the fieldName object: `"fieldName": { "type": "fieldType", "pattern": "^[a-z]{6}$" }`.

#### Adding error for field regex pattern

When adding error text to [patternErrorMesssages.json](../src/controllers/patternErrorMessages.json), the key is the name of the field the pattern is applied to, and the value is the error message that should be returned. In the above example, the new key/value pair would be `"fieldName": "must do something"`. This will return "fieldName must do something" if the pattern validation fails.

### Adding validation for field dependency

Using the example `"properties:{`
`fieldName": { "type": "fieldType" },`
`fieldName2: { "type": "fieldType2" }`
`}`:

Add dependencies by adding a dependencies field after properties. 

`"properties:{`
`fieldName": { "type": "fieldType" },`
`fieldName2: { "type": "fieldType2" }`
`},`
`"dependencies:{"`
`"fieldName":["fieldName2"]`
`}`

The above code will require `fieldName2` if `fieldName` is present.

#### Adding error for field dependency

No extra steps needed.
