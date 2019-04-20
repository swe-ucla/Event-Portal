/* Route Prefix: /uclamajors */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// Require database connection
var knex = require('../db/knex');
var throwError = require('../util');

// GET all UCLA majors
router.get('/', function(req, res, next) {
  knex('ucla_major').select()
    .then(result => {
      if (result.length) {
        res.json(result)
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => { return next(err) })
});

// Add a single UCLA major
router.get('/', function(req, res, next) {
  values = { 
    code: req.query.code,
    major: req.query.major,
    abbreviation: req.query.abbreviation,
    department: req.query.department,
    department_abbreviation: req.query.department_abbreviation,
    school: req.query.school,
    division: req.query.division
  };
  knex('ucla_major').insert(values)
    .then(result => {
      res.send("Successfully inserted new UCLA major: " + req.query.major);
    })
    .catch(err => { return next(err) });
});

// Update a single UCLA major
router.get('/:major_id', function(req, res, next) {
  values = { 
    code: req.query.code,
    major: req.query.major,
    abbreviation: req.query.abbreviation,
    department: req.query.department,
    department_abbreviation: req.query.department_abbreviation,
    school: req.query.school,
    division: req.query.division
  };
  knex('ucla_major').update(values).where({ id: req.params.major_id })
    .then(result => {
      res.send("Successfully updated UCLA major: " + req.params.major_id);
    })
    .catch(err => { return next(err) });
});

// Delete a single UCLA major
router.get('/:major_id', function(req, res, next) {
  knex('ucla_major').del().where({ id: req.params.major_id })
    .then(result => {
      res.send("Successfully deleted UCLA major: " + req.params.major_id);
    })
    .catch(err => { return next(err) });
});

module.exports = router;
