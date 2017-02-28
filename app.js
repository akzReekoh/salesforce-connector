'use strict'

let reekoh = require('reekoh')
let _plugin = new reekoh.plugins.Connector()
let async = require('async')
let jsforce = require('jsforce')
let isArray = require('lodash.isarray')
let isPlainObject = require('lodash.isplainobject')

let sendData = (data, callback) => {
  async.waterfall([
    (done) => {
      let conn = new jsforce.Connection({
        loginUrl: _plugin.config.loginUrl
      })

      conn.login(_plugin.config.username, _plugin.config.password, (error) => {
        done(error, conn)
      })
    },
    (conn, done) => {
      conn.sobject(_plugin.config.objectName).create(data, (error) => {
        done(error, conn)
      })
    },
    (conn, done) => {
      conn.logout(() => {
        done()
      })
    }
  ], callback)
}

/**
 * Emitted when device data is received.
 * This is the event to listen to in order to get real-time data feed from the connected devices.
 * @param {object} data The data coming from the device represented as JSON Object.
 */
_plugin.on('data', (data) => {
  if (isPlainObject(data)) {
    sendData(data, (error) => {
      if (error) _plugin.logException(error)
      else {
        _plugin.log(JSON.stringify({
          title: 'Salesforce data inserted.',
          object: _plugin.config.objectName,
          data: data
        }))
      }
    })
  } else if (isArray(data)) {
    async.each(data, (datum, done) => {
      sendData(datum, (error) => {
        if (error) _plugin.logException(error)
        else {
          _plugin.log(JSON.stringify({
            title: 'Salesforce data inserted.',
            object: _plugin.config.objectName,
            data: datum
          }))
        }
        done()
      })
    })
  } else {
    _plugin.logException(new Error(`Invalid data received. Data must be a valid JSON Object or a collection of objects. Data: ${data}`))
  }
})

/**
 * Emitted when the platform bootstraps the plugin. The plugin should listen once and execute its init process.
 */
_plugin.once('ready', () => {
  _plugin.log('Salesforce Connector has been initialized.')
  _plugin.emit('init')
})

module.exports = _plugin
