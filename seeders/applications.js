'use strict';

require('dotenv').config();

module.exports = {
	up: function (queryInterface, Sequelize) { 
		return queryInterface.bulkInsert('applications', [
			{
				id: Sequelize.literal('uuid_generate_v4()'), control_number: '123456789', form_name: 'FS-2700-3f', region: '38', forest: '50', district: '50', website: 'www.sample.com', 
				activity_description: 'Sample Activity', location_description: 'Sample Location', start_datetime: 'now()', end_datetime: 'now()', 
				number_participants: '100', individual_is_citizen: 't', small_business: 'f', advertising_url: 'www.sample.com', advertising_description: 'Sample Advertising', 
				client_charges: '500', experience_list: 'Sample List', created: 'now()', updated: 'now()'
			},
			{
				id: Sequelize.literal('uuid_generate_v4()'), control_number: '987654321', form_name: 'FS-2700-3b', region: '38', forest: '50', district: '50', website: 'www.sample.com', 
				activity_description: 'Sample Activity', location_description: 'Sample Location', start_datetime: 'now()', end_datetime: 'now()', 
				number_participants: '100', individual_is_citizen: 't', small_business: 'f', advertising_url: 'www.sample.com', advertising_description: 'Sample Advertising', 
				client_charges: '500', experience_list: 'Sample List', created: 'now()', updated: 'now()'
			}			
		]);
	},
	down: function (queryInterface, Sequelize) { 
		return queryInterface.bulkDelete('applications', [
			{user_name: ['123456789','987654321']} 
		]);
	}
};



