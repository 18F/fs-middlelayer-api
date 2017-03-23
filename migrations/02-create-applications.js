/* Disabling eslint rules because this code is interacting with DB*/
/* eslint-disable camelcase, no-unused-vars */
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
				allowNull: false,
				type: Sequelize.BIGINT,
				unique: true
			},
			form_type: {
				type: Sequelize.STRING,
				allowNull: false
			},
			website_addr: {
				type: Sequelize.STRING,
				allowNull: true
			},
			created: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable('applications');
	}
};
/* eslint-enable camelcase, no-unused-vars */
