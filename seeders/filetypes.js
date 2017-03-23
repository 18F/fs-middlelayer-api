'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('file_types', [
        {file_type: "INC", file_type_desc: "Insurance Certificate" },
        {file_type: "GSE", file_type_desc: "Good Standing Evidence" },
        {file_type: "OPP", file_type_desc: "Operating Plan" }
        ],{}
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete({tableName: 'file_types'}, null, {});
  }
};
