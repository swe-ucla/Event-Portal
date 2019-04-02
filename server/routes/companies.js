/* Route Prefix: /companies */
var express = require('express');
var router = express.Router();

// Returns test string to verify that Companies server is running.
router.get('/ping', function(req, res, next) {
  res.send('pong - Companies API');
});

// GET companies listing.
router.get('/', function(req, res, next) {
    // TODO
});

module.exports = router;
