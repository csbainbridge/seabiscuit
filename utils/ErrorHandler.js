module.exports = (function() {
    /**
     * Returns the error object.
     * 
     * @param {String} error The stack trace for the error.
     * @returns {Object} Returns the error object
     */
    function error( error ) {
        return {
            message: "fail",
            data: error
        }
    }
    /**
     * Object to retyrn when module function is called.
     */
    var errorHandler = {
        error: error
    }
    return errorHandler
}());