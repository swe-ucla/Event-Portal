/* Route Prefix: /companies */
var express = require('express');
var router = express.Router();

/* GET companies listing. */
router.get('/ping', function(req, res, next) {
  res.send('pong - Companies API');
});

module.exports = router;
