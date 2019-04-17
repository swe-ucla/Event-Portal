/* Route Prefix: / */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all locations
router.get('/locations', function(req, res, next) {
  db.query('SELECT * FROM location', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});
  
// GET all location names
router.get('/locations/names', function(req, res, next) {
  db.query('SELECT name FROM location', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

module.exports = router;
