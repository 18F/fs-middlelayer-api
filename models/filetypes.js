/* Disabling eslint rules because this code is interacting with DB*/
/* eslint-disable camelcase, quotes */
'use strict';
module.exports = function(sequelize, DataTypes) {
  let fileTypes = sequelize.define('file_types', {
    file_type: DataTypes.STRING,
    file_type_desc: DataTypes.STRING,
  });
  return fileTypes;
};
/* eslint-enable camelcase, quotes */
