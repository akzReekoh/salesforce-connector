'use strict';

var isJSON   = require('is-json'),
	platform = require('./platform'),
	conn, objectName;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
	if (isJSON(data, true)) {
		conn.sobject(objectName).create(data, function (error) {
			if (error) platform.handleException(error);
		});
	}
	else
		platform.handleException(new Error('Invalid input data. ' + data));
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	var config  = require('./config.json'),
		jsforce = require('jsforce');

	var password = ''.concat(options.password).concat(options.security_token);
	objectName = options.object_name;

	conn = new jsforce.Connection({
		loginUrl: options.login_url || config.login_url.default
	});

	conn.login(options.username, password, function (error) {
		if (error) return platform.handleException(error);

		platform.log('Salesforce Connector initialized.');
		platform.notifyReady();
	});
});