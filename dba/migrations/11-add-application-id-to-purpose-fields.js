'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) {
		return queryInterface.addColumn('applications', 'intake_id', {
  			type: Sequelize.STRING(255)
		});
	},

	down: function (queryInterface, Sequelize) {
		return queryInterface.removeColumn('applications', 'intake_id');
	}
};
