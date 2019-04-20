/* Route Prefix: /majors */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all majors
router.get('/', function(req, res, next) {
  knex('major').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No majors found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all major names
router.get('/names', function(req, res, next) {
  knex('major').select('name').orderBy('name', 'asc')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No major names found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a single major
router.post('/', function(req, res, next) {
  values = { name: req.query.name, ucla_id: req.query.ucla_id };
  knex('major').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new major: ' + req.query.name))
    })
    .catch(err => { return next(err) });
});

// Update a single major
router.put('/:major_id', function(req, res, next) {
  values = { name: req.query.name, ucla_id: req.query.ucla_id };
  knex('major').update(values).where({ id: req.params.major_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated major: ' + req.params.major_id));
      } else {
        util.throwError(404, 'No major found to update')
      }
    })
    .catch(err => { return next(err) });
});

// Delete a single major
router.delete('/:major_id', function(req, res, next) {
  knex('major').del().where({ id: req.params.major_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted major: ' + req.params.major_id))
      } else {
        util.throwError(404, 'No major found to delete')
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
