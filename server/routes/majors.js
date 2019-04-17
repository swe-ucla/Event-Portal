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

// Add a single major
router.post('/', function(req, res, next) {
  values = [ req.query.name, req.query.ucla_id ];
  db.query('INSERT INTO major (name, ucla_id) VALUES ($1, $2)', values, (err, result) => {
    if (err) return next(err);
    res.send("Successfully inserted new major: " + req.query.name);
  });
});

// Update a single major
// TODO: https://knexjs.org/
router.put('/:major_id', function(req, res, next) {
  values = [ req.params.major_id, req.query.name, req.query.ucla_id ];
  db.query('UPDATE major SET name = $2, ucla_id = $3 WHERE id = $1', values, (err, result) => {
    if (err) return next(err);
    res.send("Successfully updated major: " + req.query.name);
  });
});

// TODO: Delete a single major
router.delete('/:major_id', function(req, res, next) {
  const major_id = req.params.major_id;
  db.query('DELETE FROM major WHERE id = $1', [major_id], (err, result) => {
    if (err) return next(err);
    res.send("Successfully deleted major: " + req.params.major_id);
  });
});

module.exports = router;
