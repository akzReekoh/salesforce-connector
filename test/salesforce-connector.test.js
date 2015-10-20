'use strict';

const USER_NAME      = 'nigelec@gmail.com',
	  PASSWORD       = 'r33K0h321',
	  SECURITY_TOKEN = 'XkWZ26HVYAiUFVmr2Efu9ion',
	  OBJECT_NAME    = 'Account';

var _      = require('lodash'),
	cp     = require('child_process'),
	should = require('should'),
	connector;

describe('Connector', function () {
	this.slow(8000);

	after('terminate child process', function () {
		connector.kill('SIGKILL');
	});

	describe('#spawn', function () {
		it('should spawn a child process', function () {
			should.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
		});
	});

	describe('#handShake', function () {
		it('should notify the parent process when ready within 8 seconds', function (done) {
			this.timeout(8000);

			connector.on('message', function (message) {
				if (message.type === 'ready')
					done();
			});

			connector.send({
				type: 'ready',
				data: {
					options: {
						username: USER_NAME,
						password: PASSWORD,
						object_name: OBJECT_NAME,
						security_token: SECURITY_TOKEN
					}
				}
			}, function (error) {
				should.ifError(error);
			});
		});
	});

	describe('#data', function (done) {
		it('should process the data', function () {
			connector.send({
				type: 'data',
				data: {
					Name: 'Reekoh Account #' + _.random(0, 100)
				}
			}, done);
		});
	});
});