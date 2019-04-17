/* Route Prefix: / */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all categories
router.get('/categories', function(req, res, next) {
  db.query('SELECT * FROM category', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

module.exports = router;
