'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('applications', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			control_number: {
				type: Sequelize.STRING(50),
				allowNull: false,
				unique: true
			},
			form_name: {
				type: Sequelize.STRING(100),
				allowNull: false
			},
			region: {
				type: Sequelize.STRING(2)
			},
			forest: {
				type: Sequelize.STRING(2)
			},
			district: {
				type: Sequelize.STRING(2)
			},
			website: {
				type: Sequelize.STRING(255)
			},
			activity_description: {
				type: Sequelize.STRING(255)
			},
			location_description: {
				type: Sequelize.STRING(255)
			},
			start_datetime: {
				type: Sequelize.DATE
			},
			end_datetime: {
				type: Sequelize.DATE
			},
			number_participants: {
				type: Sequelize.INTEGER
			},
			individual_is_citizen: {
				type: Sequelize.BOOLEAN
			},
			small_business: {
				type: Sequelize.BOOLEAN
			},
			advertising_url: {
				type: Sequelize.STRING(255)
			},			
			advertising_description: {
				type: Sequelize.STRING(255)
			},
			client_charges: {
				type: Sequelize.STRING(255)
			},
			experience_list: {
				type: Sequelize.STRING(255)
			},
			created: {
				type: Sequelize.DATE,
				allowNull: false
			},
			updated: {
				type: Sequelize.DATE,
				allowNull: false
			}
		});
	},
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable('applications');
	}
};
