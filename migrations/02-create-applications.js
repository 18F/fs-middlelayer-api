'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('applications', {
			id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true
			},
			control_number: { //eslint-disable-line camelcase
				allowNull: false,
				type: Sequelize.BIGINT,
				unique: true
			},
			form_type: { //eslint-disable-line camelcase
				type: Sequelize.STRING,
				allowNull: false
			},
			website_addr: { //eslint-disable-line camelcase
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
	down: function(queryInterface, Sequelize) { //eslint-disable-line no-unused-vars
		return queryInterface.dropTable('applications');
	}
};
