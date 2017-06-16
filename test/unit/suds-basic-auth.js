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

	const VCAPServices = JSON.parse(process.env.VCAP_SERVICES);
	const SUDS_API_URL = VCAPServices['user-provided'][0].credentials.SUDS_API_URL;
	const SUDS_API_USERNAME = VCAPServices['user-provided'][0].credentials.password;
	const SUDS_API_PASSWORD = VCAPServices['user-provided'][0].credentials.username;

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
// behavior of the getFromBasic() or postToBasic() methods otherwise.

describe('unit test - src/controllers/basic.js - SUDS authentication', () => {
	describe('getFromBasic()', () => {
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
				return basic.getFromBasic().catch(() => {
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
				return basic.getFromBasic().catch(() => {
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
				return basic.getFromBasic().catch(() => {
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
				return basic.getFromBasic().catch(() => {
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
				sinon.stub(request, 'post')
					.onFirstCall().resolves({ token: 'token' })
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
				return basic.getFromBasic().then(() => {
					expect(request.post.callCount).to.equal(1);
					expect(request.get.callCount).to.equal(1);
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return basic.getFromBasic().then(() => {
					verifyArgsForSUDSAuthentication(request.post.args[0]);
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
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(() => {
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
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(() => {
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
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(() => {
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
				return basic.postToBasic({}, {}, testData.schema, testData.body).catch(() => {
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
				return basic.postToBasic({}, {}, testData.schema, testData.body).then(() => {
					expect(request.post.callCount).to.equal(5);
					expect(request.get.callCount).to.equal(1);
				});
			});

			it('should correctly request a SUDS authentication token', () => {
				return basic.postToBasic({}, {}, testData.schema, testData.body).then(() => {
					verifyArgsForSUDSAuthentication(request.post.args[0]);
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
