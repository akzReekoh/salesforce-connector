'use strict';

var platform      = require('./platform'),
	async         = require('async'),
	jsforce       = require('jsforce'),
	isArray       = require('lodash.isarray'),
	isPlainObject = require('lodash.isplainobject'),
	config;

var sendData = function (data, callback) {
	async.waterfall([
		(done) => {
			let conn = new jsforce.Connection({
				loginUrl: config.login_url
			});

			conn.login(config.username, config.password, (error) => {
				done(error, conn);
			});
		},
		(conn, done) => {
			conn.sobject(config.object_name).create(data, (error) => {
				done(error, conn);
			});
		},
		(conn, done) => {
			conn.logout(() => {
				done();
			});
		}
	], callback);
};

/*
 * Listen for the data event.
 */
platform.on('data', function (data) {
	if (isPlainObject(data)) {
		sendData(data, (error) => {
			if (error)
				platform.handleException(error);
			else {
				platform.log(JSON.stringify({
					title: 'Salesforce data inserted.',
					object: config.object_name,
					data: data
				}));
			}
		});
	}
	else if (isArray(data)) {
		async.each(data, (datum, done) => {
			sendData(datum, (error) => {
				if (error)
					platform.handleException(error);
				else {
					platform.log(JSON.stringify({
						title: 'Salesforce data inserted.',
						object: config.object_name,
						data: datum
					}));
				}

				done();
			});
		});
	}
	else
		platform.handleException(new Error(`Invalid data received. Data must be a valid JSON Object or a collection of objects. Data: ${data}`));
});

/*
 * Event to listen to in order to gracefully release all resources bound to this service.
 */
platform.on('close', function () {
	platform.notifyClose();
});

/*
 * Listen for the ready event.
 */
platform.once('ready', function (options) {
	let password = ''.concat(options.password).concat(options.security_token);

	Object.assign(options, {
		loginUrl: options.login_url || require('./config.json').login_url.default,
		password: password
	});

	config = options;
});