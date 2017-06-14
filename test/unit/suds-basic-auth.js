const chai = require('chai');
const expect = chai.expect;

const sinon = require('sinon');
const request = require('request-promise');

const testData = require('./suds-basic-auth.json');
const basic = require('../../src/controllers/basic');

function verifyArgsForSUDSAuthentication(args) {
	const url = args[0];
	const auth = args[1].auth;
	const json = args[1].json;

	expect(url).to.equal(`${process.env.SUDS_API_URL}/login`);
	expect(auth).to.have.property('user');
	expect(auth).to.have.property('pass');
	expect(auth.user).to.equal(process.env.SUDS_API_USERNAME);
	expect(auth.pass).to.equal(process.env.SUDS_API_PASSWORD);
	expect(json).to.equal(true);
}

// =============== IMPORTANT NOTE ===============
// These tests only check that calls to the SUDS basic API are preceded by
// a call to the /login SUDS endpoint, that the results of that call are
// handled correctly, and that subsequent calls to the SUDS API include a
// bearer token in the Authorization header.  It does NOT test the correct
// behavior of the getFromBasic() or postToBasic() methods otherwise.

describe('unit test - src/controllers/basic.js - SUDS authentication', () => {
	describe('getFromBasic()', () => {
		describe('error getting token', () => {
			const error = new Error();
			const notAnError = { };

			before(() => {
				sinon.stub(request, 'get')
					.onFirstCall().rejects(error);
			});

			beforeEach(() => {
				request.get.resetHistory();
			});

			after(() => {
				request.get.restore();
			});

			it('should make one GET request', () => {
				return basic.getFromBasic().catch(() => {
					expect(request.get.callCount).to.equal(1);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					return Promise.reject(new Error('promise should reject'));
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return basic.getFromBasic().catch(() => {
					verifyArgsForSUDSAuthentication(request.get.args[0]);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});

			it('should ultimately reject with the expected value', () => {
				return basic.getFromBasic().catch(finalResult => {
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
				sinon.stub(request, 'get')
					.onFirstCall().resolves('not a token');
			});

			beforeEach(() => {
				request.get.resetHistory();
			});

			after(() => {
				request.get.restore();
			});

			it('should make one GET request', () => {
				return basic.getFromBasic().catch(() => {
					expect(request.get.callCount).to.equal(1);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					return Promise.reject(new Error('promise should reject'));
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return basic.getFromBasic().catch(() => {
					verifyArgsForSUDSAuthentication(request.get.args[0]);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});

			it('should ultimately reject with an error', () => {
				return basic.getFromBasic().catch(finalResult => {
					expect(finalResult.message).to.equal('Token not in data returned from SUDS basic API');
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
				sinon.stub(request, 'get')
					.onFirstCall().resolves({ token: 'token' })
					.onSecondCall().resolves('hello world');
			});

			beforeEach(() => {
				request.get.resetHistory();
			});

			after(() => {
				request.get.restore();
			});

			it('should make two GET requests', () => {
				return basic.getFromBasic().then(() => {
					expect(request.get.callCount).to.equal(2);
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return basic.getFromBasic().then(() => {
					verifyArgsForSUDSAuthentication(request.get.args[0]);
				});
			});

			it('should ultimately resolve with the expected value', () => {
				return basic.getFromBasic().then(finalResult => {
					expect(finalResult).to.equal('hello world');
				});
			});
		});
	});

	describe('postToBasic()', () => {
		describe('error getting token', () => {
			const error = new Error();
			const notAnError = { };

			before(() => {
				sinon.stub(request, 'get')
					.onFirstCall().rejects(error);
			});

			beforeEach(() => {
				request.get.resetHistory();
			});

			after(() => {
				request.get.restore();
			});

			it('should make one GET request', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(() => {
					expect(request.get.callCount).to.equal(1);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					return Promise.reject(new Error('promise should reject'));
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(() => {
					verifyArgsForSUDSAuthentication(request.get.args[0]);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});

			it('should ultimately reject with the expected value', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(finalResult => {
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
				sinon.stub(request, 'get')
					.onFirstCall().resolves('not a token');
			});

			beforeEach(() => {
				request.get.resetHistory();
			});

			after(() => {
				request.get.restore();
			});

			it('should make one GET request', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(() => {
					expect(request.get.callCount).to.equal(1);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					return Promise.reject(new Error('promise should reject'));
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(() => {
					verifyArgsForSUDSAuthentication(request.get.args[0]);
					return notAnError;
				}).then(err => {
					if (err === notAnError) {
						return;
					}
					throw new Error('should reject');
				});
			});

			it('should ultimately reject with an error', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(finalResult => {
					expect(finalResult.message).to.equal('Token not in data returned from SUDS basic API');
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
				sinon.stub(request, 'get')
					.onCall(0).resolves({ token: 'token' })
					.onCall(1).resolves([]);
				sinon.stub(request, 'post').resolves({});
			});

			beforeEach(() => {
				request.get.resetHistory();
				request.post.resetHistory();
			});

			after(() => {
				request.get.restore();
				request.post.restore();
			});

			it('should make two GET requests', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).then(() => {
					expect(request.get.callCount).to.equal(2);
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).then(() => {
					verifyArgsForSUDSAuthentication(request.get.args[0]);
				});
			});

			it('should ultimately resolve with the expected value', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).then(finalResult => {
					expect(finalResult).to.be.an('object');
				});
			});
		});
	});
});
