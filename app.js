'use strict';

var platform = require('./platform'),
	async = require('async'),
	sf = require('node-salesforce'),
	username, password, loginUrl, accessToken, instanceUrl;

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {

	// If using OAuth2, uncomment the line of codes below
	//var conn = new sf.Connection({
	//	instanceUrl: instanceUrl,
	//	accessToken: accessToken
	//});
    //
	//conn.sobject(data.objectName).create(data.objectProps, function (err, ret) {
    //
	//});

	//If using normal login
	var conn = new sf.Connection({

		loginUrl: loginUrl
	});

	async.series([

		function (cb) {
			conn.login(username, password, function (err, userInfo) {
				cb(null, userInfo);
			});
		},

		function (cb) {
			conn.sobject(data.objectName).create(data.objectProps, function (err, ret) {
				cb(null, ret);
			});
		}

	], callback);

	console.log(data);
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {

	//If using OAuth2, uncomment the line of codes below
	//var conn = new sf.Connection({
	//	oauth2: {
	//		clientId: options.clientId,
	//		clientSecret: options.clientSecret,
	//		redirectUri: options.redirectUri
	//	}
	//});
    //
	//conn.login(options.username, options.password, function (err, userInfo) {
    //
	//	if (err)
	//		console.log(err);
    //
	//	accessToken = conn.accessToken;
	//	instanceUrl = conn.instanceUrl;
	//});


	//If using normal login, just initialize the username and passoword
	username = options.username;
	password = options.password;
	loginUrl = options.loginUrl;

	console.log(options);
	platform.notifyReady();
});