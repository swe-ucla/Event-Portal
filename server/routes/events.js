/* Route Prefix: /events */
var express = require('express');
var router = express.Router();

// Returns test string to verify that Events server is running. 
router.get('/ping', function(req, res, next) {
  res.send('pong - Events API');
});

// GET events listing. 
router.get('/', function(req, res, next) {
    // TODO
});

module.exports = router;
