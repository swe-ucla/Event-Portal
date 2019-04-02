/* Route Prefix: /users */
var express = require('express');
var router = express.Router();

// Returns test string to verify that Users server is running.
router.get('/ping', function(req, res, next) {
  res.send('pong - Users API');
});

// GET users listing.
router.get('/', function(req, res, next) {
    // TODO
});

module.exports = router;
