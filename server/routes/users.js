/* Route Prefix: /users */
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/ping', function(req, res, next) {
  res.send('pong - Users API');
});

module.exports = router;
