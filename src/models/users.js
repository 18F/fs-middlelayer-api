'use strict';
module.exports = function(sequelize, DataTypes) {
	const users = sequelize.define('users', {
		user_name: DataTypes.STRING,
		pass_hash: DataTypes.STRING,
		user_role: DataTypes.STRING,
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
		updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated' }
	}, {
		timestamps  : true
	});
	return users;
};
