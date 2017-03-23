/* Disabling eslint rules because this code is interacting with DB*/
/* eslint-disable camelcase, quotes */
'use strict';
module.exports = function(sequelize, DataTypes) {
  let users = sequelize.define('users', {
    user_name: DataTypes.STRING,
    pass_hash: DataTypes.STRING,
    user_role: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated' }
  }, {
    timestamps  : true
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return users;
};
/* eslint-enable camelcase, quotes */
