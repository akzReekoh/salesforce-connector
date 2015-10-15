/*
 * Just a sample code to test the connector plugin.
 * Kindly write your own unit tests for your own plugin.
 */
'use strict';

var cp     = require('child_process'),
	assert = require('assert'),
	connector;

describe('Connector', function () {
	this.slow(5000);

	after('terminate child process', function () {
		connector.kill('SIGKILL');
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			assert.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 5 seconds', function (done) {
			this.timeout(5000);

			connector.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			connector.send({
				type: 'ready',
				data: {
					options: {
						username: 'ncanoizado@barhead.ph',
						password: 'r33K0h321',
						loginUrl: 'https://ap2.salesforce.com'
					}
				}
				//data: {
				//	options: {
				//		username: '',
				//		password: '',
				//		loginUrl: '',
				//		clientId: '',
				//		clientSecret: '',
				//		redirectUri: ''
				//	}
				//}
			}, function (error) {
				assert.ifError(error);
			});
		});
	});

	describe('#data', function (done) {
		it('should process the data', function () {
			connector.send({
				type: 'data',
				data: {
					objectName: 'Account',
					objectProps: {
						Name: 'Salesforce Account#1'
					}
				}
				//data: {
				//	objectName: 'AirQuality',
				//	objectProps: {
				//		cbsa: '',
				//		co_1hr: '',
				//		co_8hr: '',
				//		no2_1hr: '',
				//		no_annual: '',
				//		o3_1hr: '',
				//		o3_8hr: '',
				//		so2_1hr: '',
				//		so2_24hr: '',
				//		so2_annual: '',
				//		pm2: '',
				//		pm10: '',
                 //       lead: ''
				//	}

			}, done);
		});
	});
});