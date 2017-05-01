var express = require('express');
var router = express.Router();
var api = require('./api-server-routes/api-routes')

router.use('/', api)

module.exports = router