/* Route Prefix: /users */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with users resource');
});

module.exports = router;
