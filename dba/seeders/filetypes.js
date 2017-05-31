'use strict';

module.exports = {
	up: function (queryInterface, Sequelize) { 
		return queryInterface.bulkInsert('file_types', [
			{file_type: 'gud', file_type_name: 'guideDocumentation', file_type_desc: 'Guide Documentation' }, 
			{file_type: 'arf', file_type_name: 'acknowledgementOfRiskForm', file_type_desc: 'Acknowledgement of Risk Form' },
			{file_type: 'inc', file_type_name: 'insuranceCertificate', file_type_desc: 'Insurance Certificate' }, 
			{file_type: 'gse', file_type_name: 'goodStandingEvidence', file_type_desc: 'Good Standing Evidence' }, 
			{file_type: 'opp', file_type_name: 'operatingPlan', file_type_desc: 'Operating Plan' }
		]);
	},
	down: function (queryInterface, Sequelize) {
		return queryInterface.bulkDelete('file_types', [
			{file_type: ['gud','arf','inc','gse','opp']} 
		]);
	}
};
