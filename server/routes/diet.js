/* Route Prefix: / */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all diet types
router.get('/diet', function(req, res, next) {
  db.query('SELECT * FROM diet', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

module.exports = router;
