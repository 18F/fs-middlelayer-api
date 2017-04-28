'use strict';
module.exports = function(sequelize, DataTypes) {
	const users = sequelize.define('users', {
		userName: { type: DataTypes.STRING, field: 'user_name' },
		passHash: { type: DataTypes.STRING, field: 'pass_hash' },
		userRole: { type: DataTypes.STRING, field: 'user_role' },
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
		updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated' }
	}, {
		timestamps  : true
	});
	return users;
};
