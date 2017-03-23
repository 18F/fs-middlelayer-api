'use strict';
module.exports = function(sequelize, DataTypes) {
  var applications = sequelize.define('applications', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    control_number: DataTypes.INTEGER,
    form_type: DataTypes.STRING,
    website_addr: DataTypes.STRING,
    createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
    updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated' }
  }, {
    timestamps  : true
  }, {
    classMethods: {
      associate: function(models) {
        applications.hasMany(models.files, {
          foreignKey: 'application_id',
          as: 'file_items',
        });
      }
    }
  });
  return applications;
};