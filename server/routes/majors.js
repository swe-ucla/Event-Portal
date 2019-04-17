/* Route Prefix: /majors */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all majors
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM major', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all major names
router.get('/names', function(req, res, next) {
  db.query('SELECT name FROM major ORDER BY name ASC', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

module.exports = router;
