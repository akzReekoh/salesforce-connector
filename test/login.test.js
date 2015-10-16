'use strict';

var async = require('async'),
    sf = require('node-salesforce'),
    //username = 'ncanonizado@barhead.ph',
    username = 'nigelec@gmail.com',
    password = 'r33K0h321',
    loginUrl = 'https://login.salesforce.com',
    //securityToken = 'zmkqhovKV5ZeQ6RNrCNeGMofq', //This is for the barhead account
    securityToken = 'XkWZ26HVYAiUFVmr2Efu9ion',  //This is for the gmail account
    data = {
        objectName: 'Account',
        objectProps: {
            Name: 'Salesforce Account#2'
        }
    };


var conn = new sf.Connection({

    loginUrl: loginUrl
});

async.series([

    function (cb) {
        conn.login(username, password + securityToken, function (err, userInfo) {

            if (err)
               console.log('Login ' + err);
            else {

                cb(null, userInfo);
                console,log('UserInfo ' + userInfo);
            }
        });
    },

    function (cb) {

        conn.sobject(data.objectName).create(data.objectProps, function (err, ret) {

            if (err)
                console.log('Create ' + err);

            cb(null, ret);
        });
    }

], function (err, results) {

});
