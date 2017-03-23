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