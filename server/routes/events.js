/* Route Prefix: /events */
var express = require('express');
var router = express.Router();

/* GET events listing. */
router.get('/ping', function(req, res, next) {
  res.send('pong - Events API');
});

module.exports = router;
