'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.changeColumn('applications', 'client_charges', {
			type: Sequelize.STRING(512),
			allowNull: false
		});
	},
	down: function (queryInterface, Sequelize) {
		return queryInterface.changeColumn('applications', 'client_charges', {
			type: Sequelize.STRING(255),
			allowNull: true
		});
	}
};
