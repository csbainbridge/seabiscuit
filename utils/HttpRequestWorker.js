/**
 * HTTPRequestWorker is a wrapper module around the popular request module.
 * It allows custom configuration of http requests with additional parameters and returns a promised value.
 * Author: Curtis Samuel Bainbridge
 */

var request = require('request')
var Promise = require('bluebird');
Promise.promisifyAll(request)

/** httpReqWorker.post(path, {method: "POST", }) */
/** Options // Could send an array of params, then we can dynamically these to the url of the request
 * {
 *  baseUrl: value,
 *  param1: value,
 *  param2: value,
 *  method: value,
 *  format: value
 *  data: value,
 * }
 */

module.exports = (function(){
    function addFormat( format, req ) {
        if ( config.format === 'json') {
            req.json = true
        } else if ( config.format === 'xml' ) {
            req.xml = true
        }
        return req
    }
    function send( config ) {
        return new Promise(function( resolve, reject ) {
            var req = {}
            if ( config.hasOwnProperty(param2) ) {
                req = {
                    url : config.baseUrl + config.param1 + config.param2,
                    method : config.method,
                    body : config.data
                }
                req = addFormat(config.format, req)
            }
            // TODO: Test this module to see if the request is configured correctly
            console.log(req)
            requestAsync(req)
            .then(function(success){
                resolve(success)
            })
            .catch(function(error){
                reject(error)
            })
        })
    }
    var postConfig = {
        send: send
    }
    return postConfig
}());