var Promise = require('bluebird');

var apiPostHandler = (function() {
    var query;
    var data;
    var controller;
    var response;
    function errorHandler(error){
        return {
            message: "fail",
            data: error
        }
    }
    function callCreate(){
        var response = apiPostHandler.controller.create(apiPostHandler.data).then(function(newEntity){
            return { message: "success", data: newEntity + ' created' };
        })
        .catch(errorHandler)
        return response;
    }
    function getEntities(entities){
        return new Promise(function(resolve, reject){
            if ( entities.length === 0) {
                var response = callCreate()
                resolve(response);
            } else {
                //TODO: If country already exists process meeting
            }
        })
    }
    function init(query, data, controller) {
        apiPostHandler.query = query;
        apiPostHandler.data = data;
        apiPostHandler.controller = controller
        var response = controller.find(query).then(getEntities).then(function(response){
            return response
        })
        .catch(errorHandler)
        return response
    }
    var apiPostHandler = {
        init: init,
        query: query,
        data: data,
        controller: controller
    }
    return apiPostHandler;
}());

module.exports = apiPostHandler;