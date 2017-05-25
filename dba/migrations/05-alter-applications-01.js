'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.addColumn('applications', 'number_spectators', {
  			type: Sequelize.INTEGER
		});
	},

	down: function (queryInterface, Sequelize) {
		return queryInterface.removeColumn('applications', 'number_spectators');
	}
};