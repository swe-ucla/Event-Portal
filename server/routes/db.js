/* Route Prefix: /db */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

router.get('/', function(req, res, next) {
  db.query('SELECT * FROM test', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  db.query('SELECT * FROM test WHERE id = $1', [id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows[0]);
  });
});

module.exports = router;
