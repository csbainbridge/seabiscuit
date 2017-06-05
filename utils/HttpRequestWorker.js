/**
 * HTTPRequestWorker is a wrapper module around the popular request module.
 * It allows custom configuration of http requests with additional parameters and returns a promised value.
 * Author: Curtis Samuel Bainbridge
 */

var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
/** httpReqWorker.post(path, {method: "POST", }) */
/** Options // Could send an array of params, then we can dynamically these to the url of the request
 * {
 *  url: value
 *  format: value
 *  data: value,
 * }
 */

module.exports = (function(){
    function addFormat( format, req ) {
        return new Promise(function( resolve, reject ) {
            if ( format === 'json') {
                req.json = true
            } else if ( format === 'xml' ) {
                req.xml = true
            } else {
                reject("Invalid data format specified")
            }
            resolve(req) 
        })
    }
    function send( config ) {
        return new Promise(function( resolve, reject ) {
            var req = {}
            req = {
                url : config.url.replace(' ', '+'),
                method : config.method,
                body : config.data
            }
            addFormat(config.format, req)
            .then(request)
            .then(function() {
                resolve("POST to - " + url + " @ " + new Date())
            })
            .catch(function(error) {
                reject("POST Failure @ " + new Date() + " " + error)
            })
        })
    }
    var postConfig = {
        send: send
    }
    return postConfig
}());