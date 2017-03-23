'use strict';
module.exports = function(sequelize, DataTypes) {
	const users = sequelize.define('users', {
		user_name: DataTypes.STRING, //eslint-disable-line camelcase
		pass_hash: DataTypes.STRING, //eslint-disable-line camelcase
		user_role: DataTypes.STRING, //eslint-disable-line camelcase
		createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'created' },
		updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, field: 'updated' }
	}, {
		timestamps  : true
	});
	return users;
};
