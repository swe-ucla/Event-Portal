var express = require('express');
var router = express.Router();

/* GET events listing. */
router.get('/', function(req, res, next) {
  res.send('respond with events resource');
});

module.exports = router;
