'use strict';

var platform = require('./platform'),
	sf = require('node-salesforce'),
	accessToken, instanceUrl;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {

	// TODO: Send data outbound to the other platform, service or app here.
	var conn = new sf.Connection({
		instanceUrl: instanceUrl,
		accessToken: accessToken
	});

	conn.sobject(data.objectName).create(data.objectProps, function (err, ret) {

	});
	console.log(data);
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {

	var conn = new sf.Connection({
		oauth2: {
			clientId: options.clientId,
			clientSecret: options.clientSecret,
			redirectUri: options.redirectUri
		}
	});

	conn.login(options.username, options.password, function (err, userInfo) {

		if (err)
			console.log(err);

		accessToken = conn.accessToken;
		instanceUrl = conn.instanceUrl;
	});

	console.log(options);
	platform.notifyReady();
});