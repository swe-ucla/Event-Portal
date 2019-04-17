/* Route Prefix: /addresses */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all addresses
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM address', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});
  
// GET all address names
router.get('/names', function(req, res, next) {
  db.query('SELECT name FROM address', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

module.exports = router;
