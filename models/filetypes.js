'use strict';
module.exports = function(sequelize, DataTypes) {
  var fileTypes = sequelize.define('file_types', {
    file_type: DataTypes.STRING,
    file_type_desc: DataTypes.STRING,
  });
  return fileTypes;
};