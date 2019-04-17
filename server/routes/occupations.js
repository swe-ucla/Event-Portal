/* Route Prefix: /occupations */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all occupations
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM occupation', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

module.exports = router;
