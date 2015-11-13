'use strict';

var platform = require('./platform'),
	conn, objectName;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {

	conn.sobject(objectName).create(data, function (error) {
		if (error)
			platform.handleException(error);
		else {
			platform.log(JSON.stringify({
				title: 'Salesforce data inserted.',
				object: objectName,
				data: data
			}));
		}
	});

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