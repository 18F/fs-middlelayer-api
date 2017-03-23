/* Disabling eslint rules because this code is interacting with DB*/
/* eslint-disable camelcase */
'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('file_types', {
      file_type: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_type_desc: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('file_types');
  }
};
/* eslint-enable camelcase */
