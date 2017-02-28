'use strict'

const amqp = require('amqplib')

const USER_NAME = 'rbanquerigo@reekoh.com'
const PASSWORD = 'nigel123'
const SECURITY_TOKEN = 'Qqg7vdHHsdfBE0VW7GznPTpn8'
const OBJECT_NAME = 'Account'

let _channel = null
let _conn = null
let app = null

describe('Salesforce Connector Test', () => {
  before('init', () => {
    process.env.ACCOUNT = 'adinglasan'
    process.env.CONFIG = JSON.stringify({
      username: USER_NAME,
      password: PASSWORD,
      objectName: OBJECT_NAME,
      securityToken: SECURITY_TOKEN
    })
    process.env.INPUT_PIPE = 'ip.salesforce'
    process.env.LOGGERS = 'logger1, logger2'
    process.env.EXCEPTION_LOGGERS = 'ex.logger1, ex.logger2'
    process.env.BROKER = 'amqp://guest:guest@127.0.0.1/'

    amqp.connect(process.env.BROKER)
      .then((conn) => {
        _conn = conn
        return conn.createChannel()
      }).then((channel) => {
      _channel = channel
    }).catch((err) => {
      console.log(err)
    })
  })

  after('close connection', function (done) {
    _conn.close()
    done()
  })

  describe('#start', function () {
    it('should start the app', function (done) {
      this.timeout(10000)
      app = require('../app')
      app.once('init', done)
    })
  })

  describe('#data', () => {
    it('should send data to third party client', function (done) {
      this.timeout(15000)

      let data = {
        Name: 'Reekoh Account #' + Math.random(0, 100)
      }

      _channel.sendToQueue('ip.salesforce', new Buffer(JSON.stringify(data)))
      setTimeout(done, 10000)
    })
  })
})

// 'use strict';
//
// const USER_NAME      = 'rbanquerigo@reekoh.com',
// 	  PASSWORD       = 'nigel123',
// 	  SECURITY_TOKEN = 'Qqg7vdHHsdfBE0VW7GznPTpn8',
// 	  OBJECT_NAME    = 'Account';
//
// var _      = require('lodash'),
// 	cp     = require('child_process'),
// 	should = require('should'),
// 	connector;
//
// describe('Connector', function () {
// 	this.slow(8000);
//
// 	after('terminate child process', function () {
// 		connector.send({
// 			type: 'close'
// 		});
//
// 		setTimeout(function () {
// 			connector.kill('SIGKILL');
// 		}, 4000);
// 	});
//
// 	describe('#spawn', function () {
// 		it('should spawn a child process', function () {
// 			should.ok(connector = cp.fork(process.cwd()), 'Child process not spawned.');
// 		});
// 	});
//
// 	describe('#handShake', function () {
// 		it('should notify the parent process when ready within 8 seconds', function (done) {
// 			this.timeout(8000);
//
// 			connector.on('message', function (message) {
// 				if (message.type === 'ready')
// 					done();
// 			});
//
// 			connector.send({
// 				type: 'ready',
// 				data: {
// 					options: {
// 						username: USER_NAME,
// 						password: PASSWORD,
// 						object_name: OBJECT_NAME,
// 						security_token: SECURITY_TOKEN
// 					}
// 				}
// 			}, function (error) {
// 				should.ifError(error);
// 			});
// 		});
// 	});
//
// 	describe('#data', function (done) {
// 		it('should process the data', function () {
// 			connector.send({
// 				type: 'data',
// 				data: {
// 					Name: 'Reekoh Account #' + _.random(0, 100)
// 				}
// 			}, done);
// 		});
// 	});
// });