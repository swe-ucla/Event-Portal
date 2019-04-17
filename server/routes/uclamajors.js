/* Route Prefix: /uclamajors */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all UCLA majors
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM ucla_major', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

module.exports = router;
