'use strict';

var async = require('async'),
	isJSON   = require('is-json'),
	platform = require('./platform'),
	conn, objectName, username, password;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
	if (isJSON(data, true)) {

		async.series([

		function (cb) {
			conn.login(options.username, password, function (error) {
				if (error) return platform.handleException(error);

				cb(null);
			});

		},

		function (cb) {
			conn.sobject(objectName).create(data, function (error) {
				if (error)
					platform.handleException(error);
				else {
					platform.log(JSON.stringify({
						title: 'Salesforce data inserted.',
						object: objectName,
						data: data
					}));
					cb(null)
				}
			});
		}

		]);
	}
	else
		platform.handleException(new Error('Invalid data received. ' + data));
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	var domain = require('domain');
	var d = domain.create();

	d.on('error', function(error) {
		console.error(error);
		platform.handleException(error);
		platform.notifyClose();
	});

	d.run(function() {
		conn.logout(function () {
			platform.notifyClose();
		});
	});
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var config  = require('./config.json'),
		jsforce = require('jsforce');

	username = options.username;
	password = ''.concat(options.password).concat(options.security_token);
	objectName = options.object_name;

	conn = new jsforce.Connection({
		loginUrl: options.login_url || config.login_url.default
	});

	platform.log('Salesforce Connector initialized.');
	platform.notifyReady();
});