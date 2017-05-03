module.exports = (function() {
    var query;
    var data;
    var controller;
    function errorHandler(error){
        return { message: "fail", data: error }
    }
    function getEntities(entities){
        if ( entities.length === 0) {
            return apiPostHandler.controller.create(apiPostHandler.data).catch(errorHandler)
        } else {
            return { message: "fail", data: 'entity already exists' }
        }
    }
    function findOrCreate(query, data, controller) {
        apiPostHandler.query = query;
        apiPostHandler.data = data;
        apiPostHandler.controller = controller
        return controller.find(query).then(getEntities).catch(errorHandler)
    }
    var apiPostHandler = {
        findOrCreate: findOrCreate,
    }
    return apiPostHandler;
}());