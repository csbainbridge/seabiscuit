/**
 * API Response Handler
 */

module.exports = {
    /**
     * When an invalid resource route is used return a fail message.
     * 
     * @param {object} res The response object.
     */
    invalid: function(res) {
        res.json({
            message: 'fail',
            data: 'invalid resource'
        })
    },
    /**
     * When all data is found return success message.
     * 
     * @param {Object} res The response object
     * @param {Array} data Array of data from the database
     */
    success: function( res, data ) {
        res.json({
            message: 'success',
            data: data
        })
    },
    /**
     * When a resource is not found return fail message.
     * 
     * @param {Object} res The response object
     * @param {String} resource The resource requested
     */
    notFound: function( res, resource ) {
        res.json({
            message: 'fail',
            data: resource + ' not found'
        })
    },
    /**
     * When there is a database error return fail message.
     * 
     * @param {Object} res The response object
     * @param {Object} error The error object
     */
    error: function( res, error ) {
        res.json({
            message: 'fail',
            data: error
        })
    }
}

