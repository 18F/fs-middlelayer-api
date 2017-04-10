const jsf = require('json-schema-faker');
const include = require('include')(__dirname);

function fromAdminOrg(cnData, postSchema, jsonData, key){

	const adminOrg = cnData[postSchema.adminOrg.intake];
	switch (key){
	case 'region':
		jsonData[key] = adminOrg.slice(0, 2);
		break;
	case 'forest':
		jsonData[key] = adminOrg.slice(2, 4);
		break;
	case 'district':
		jsonData[key] = adminOrg.slice(4, 6);
		break;
	}

}

function getTopLevelField(intakeField, cnData, postSchema, jsonData, key){

	switch (intakeField){
	case 'middleLayer':
		//jsonData[key] = getFromMiddleLayer(key)
		break;
	case 'none':
		break;
	case 'fromAdminOrg':
		fromAdminOrg(cnData, postSchema, jsonData, key);
		break;
	default:
		if (cnData.hasOwnProperty(postSchema[key].intake)){
	
			jsonData[key] = cnData[postSchema[key].intake];
		
		}
	}

}

function getSubLevelField(cnData, postSchema, key, jsonData){

	const addressData = cnData.addresses[0];
	const phoneData = cnData.phones[0];
	const holderData = cnData.holders[0];
	const path = postSchema[key].intake.split('/');
	let data;
	switch (path[0]){
	case 'holders':
		data = holderData;
		break;
	case 'phones':
		data = phoneData;
		break;
	case 'addresses':
		data = addressData;
		break;
	}
	if (data.hasOwnProperty(path[1])){
		jsonData[key] = data[path[1]];
	}

}

function buildGetResponse(cnData, applicationData, schemaData, jsonData, postSchema){

	let key; 
	for (key in schemaData){
		
		if (typeof jsonData[key] !== 'object'){
			
			const intakeField = postSchema[key].intake;
			if (intakeField.startsWith('middleLayer/')){
				const applicationField = intakeField.split('/')[1];
				jsonData[key] = applicationData[applicationField];
			}
			else {

				if (intakeField.indexOf('/') === -1){
					getTopLevelField(intakeField, cnData, postSchema, jsonData, key);	
				}
				else {
					
					getSubLevelField(cnData, postSchema, key, jsonData);
				}
			}
		}
		else {
			buildGetResponse(cnData, applicationData, schemaData[key], jsonData[key], postSchema[key]);
		}
	}

}
function copyGenericInfo(cnData, applicationData, jsonData, outputSchema){

	//Get from schema
	jsf.option({useDefaultValue:true});
	const schemaData = jsf(outputSchema);
	delete schemaData.id;

	jsonData = schemaData;
	buildGetResponse(cnData, applicationData, schemaData, jsonData, outputSchema);

	return jsonData;
}

function concatErrors(errorMessages){

	let output = '';
	errorMessages.forEach((message)=>{
		output = `${output}${message} `;
	});
	output = output.trim();
	return output;
}

module.exports.copyGenericInfo = copyGenericInfo;
module.exports.concatErrors = concatErrors;
