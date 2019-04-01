/* Route Prefix: /companies */
var express = require('express');
var router = express.Router();

/* GET companies listing. */
router.get('/', function(req, res, next) {
  res.send('respond with companies resource');
});

module.exports = router;
