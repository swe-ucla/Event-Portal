/* Route Prefix: /majors */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');

// GET all majors
router.get('/', function(req, res, next) {
  knex('major').select()
    .then(result => {
      if (result.length) {
        res.json(result)
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => { return next(err) })
});

// GET all major names
router.get('/names', function(req, res, next) {
  knex('major').select('name').orderBy('name', 'asc')
    .then(result => {
      if (result.length) {
        res.json(result)
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => { return next(err) })
});

// Add a single major
router.post('/', function(req, res, next) {
  values = { name: req.query.name, ucla_id: req.query.ucla_id };
  knex('major').insert(values)
    .then(result => {
      res.send("Successfully inserted new major: " + req.query.name);
    })
    .catch(err => { return next(err) });
});

// Update a single major
router.put('/:major_id', function(req, res, next) {
  values = { name: req.query.name, ucla_id: req.query.ucla_id };
  knex('major').update(values).where({ id: req.params.major_id })
    .then(result => {
      res.send("Successfully updated major: " + req.params.major_id);
    })
    .catch(err => { return next(err) });
});

// Delete a single major
router.delete('/:major_id', function(req, res, next) {
  knex('major').del().where({ id: req.params.major_id })
    .then(result => {
      res.send("Successfully deleted major: " + req.params.major_id);
    })
    .catch(err => { return next(err) });
});

module.exports = router;
