const chai = require('chai');
const expect = chai.expect;

const sinon = require('sinon');
const request = require('request-promise-native');

const testData = require('./suds-basic-auth.json');
const SUDSConnection = require('../../src/controllers/sudsconnection');
const vcapConstants = require('../../src/controllers/vcap-constants.js');

function verifyArgsForSUDSAuthentication(args) {
	const url = args[0];
	const auth = args[1].auth;
	const json = args[1].json;

	const SUDS_API_URL = `http://localhost:${process.env.PORT}/mocks`;
	const SUDS_API_USERNAME = vcapConstants.SUDS_INFO.username;
	const SUDS_API_PASSWORD = vcapConstants.SUDS_INFO.password;

	expect(url).to.equal(`${SUDS_API_URL}/login`);
	expect(auth).to.have.property('user');
	expect(auth).to.have.property('pass');
	expect(auth.user).to.equal(SUDS_API_USERNAME);
	expect(auth.pass).to.equal(SUDS_API_PASSWORD);
	expect(json).to.equal(true);
}

// =============== IMPORTANT NOTE ===============
// These tests only check that calls to the SUDS basic API are preceded by
// a call to the /login SUDS endpoint, that the results of that call are
// handled correctly, and that subsequent calls to the SUDS API include a
// bearer token in the Authorization header.  It does NOT test the correct
// behavior of the getFromBasic() or post() methods otherwise.

describe('unit test - src/controllers/SUDSConnection.js - SUDS authentication', () => {
	describe('get()', () => {
		describe('error getting token', () => {
			const error = new Error();
			const notAnError = { };

			before(() => {
				sinon.stub(request, 'post')
					.onFirstCall().rejects(error);
			});

			beforeEach(() => {
				request.post.resetHistory();
			});

			after(() => {
				request.post.restore();
			});

			it('should make one post request', () => {
				return SUDSConnection.get().catch(() => {
					expect(request.post.callCount).to.equal(1);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					return Promise.reject(new Error('promise should reject'));
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return SUDSConnection.get().catch(() => {
					verifyArgsForSUDSAuthentication(request.post.args[0]);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});

			it('should ultimately reject with the expected value', () => {
				return SUDSConnection.get().catch(finalResult => {
					expect(finalResult).to.equal(error);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});
		});

		describe('returned body from SUDS is invalid', () => {
			const notAnError = { };

			before(() => {
				sinon.stub(request, 'post')
					.onFirstCall().resolves('not a token');
			});

			beforeEach(() => {
				request.post.resetHistory();
			});

			after(() => {
				request.post.restore();
			});

			it('should make one post request', () => {
				return SUDSConnection.get().catch(() => {
					expect(request.post.callCount).to.equal(1);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					return Promise.reject(new Error('promise should reject'));
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return SUDSConnection.get().catch(() => {
					verifyArgsForSUDSAuthentication(request.post.args[0]);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});

			it('should ultimately reject with an error', () => {
				return SUDSConnection.get().catch(finalResult => {
					expect(finalResult.message).to.equal('Unable to retrieve valid token from SUDS API.');
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});
		});

		describe('no errors', () => {
			before(() => {
				sinon.stub(request, 'post')
					.onFirstCall().resolves({ token: 'token' });
				sinon.stub(request, 'get').onFirstCall().resolves('hello world');
			});

			beforeEach(() => {
				request.get.resetHistory();
				request.post.resetHistory();
			});

			after(() => {
				request.get.restore();
				request.post.restore();
			});

			it('should make one GET and one POST requests', () => {
				return SUDSConnection.get().then(() => {
					expect(request.post.callCount).to.equal(1);
					expect(request.get.callCount).to.equal(1);
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return SUDSConnection.get().then(() => {
					verifyArgsForSUDSAuthentication(request.post.args[0]);
				});
			});

			it('should ultimately resolve with the expected value', () => {
				return SUDSConnection.get().then(finalResult => {
					expect(finalResult).to.equal('hello world');
				});
			});
		});
	});

	describe('post()', () => {
		describe('error getting token', () => {
			const error = new Error();
			const notAnError = { };

			before(() => {
				sinon.stub(request, 'post')
					.onFirstCall().rejects(error);
				sinon.stub(request, 'get');
			});

			beforeEach(() => {
				request.post.resetHistory();
				request.get.resetHistory();
			});

			after(() => {
				request.post.restore();
				request.get.restore();
			});

			it('should make one GET request', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).catch(() => {
					expect(request.post.callCount).to.equal(1);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					return Promise.reject(new Error('promise should reject'));
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).catch(() => {
					verifyArgsForSUDSAuthentication(request.post.args[0]);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});

			it('should ultimately reject with the expected value', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).catch(finalResult => {
					expect(finalResult).to.equal(error);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});
		});

		describe('returned body from SUDS is invalid', () => {
			const notAnError = { };

			before(() => {
				sinon.stub(request, 'post')
					.onFirstCall().resolves('not a token');
				sinon.stub(request, 'get');
			});

			beforeEach(() => {
				request.get.resetHistory();
				request.post.resetHistory();
			});

			after(() => {
				request.get.restore();
				request.post.restore();
			});

			it('should make one POST request', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).catch(() => {
					expect(request.post.callCount).to.equal(1);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					return Promise.reject(new Error('promise should reject'));
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).catch(() => {
					verifyArgsForSUDSAuthentication(request.post.args[0]);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});

			it('should ultimately reject with an error', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).catch(finalResult => {
					expect(finalResult.message).to.equal('Unable to retrieve valid token from SUDS API.');
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});
		});

		describe('no errors', () => {
			before(() => {
				sinon.stub(request, 'post')
					.resolves({contCn: '3'})
					.onFirstCall().resolves({ token: 'token' });
				sinon.stub(request, 'get').resolves([]);
			});

			beforeEach(() => {
				request.get.resetHistory();
				request.post.resetHistory();
			});

			after(() => {
				request.get.restore();
				request.post.restore();
			});

			it('should make one GET and one POST requests', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).then(() => {
					expect(request.post.callCount).to.equal(5);
					expect(request.get.callCount).to.equal(1);
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).then(() => {
					verifyArgsForSUDSAuthentication(request.post.args[0]);
				});
			});

			it('should ultimately resolve with the expected value', () => {
				return SUDSConnection.post({}, {}, testData.schema, testData.body).then(finalResult => {
					expect(finalResult).to.be.an('object');
				});
			});
		});
	});
});
