/* Route Prefix: /hiringlocations */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all hiring locations
router.get('/', function(req, res, next) {
  knex('hiring_locations').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No hiring locations found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all hiring locations names
router.get('/locations', function(req, res, next) {
  knex('hiring_locations').select('location')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No hiring locations found');
      }
    })
    .catch(err => { return next(err) });
});

// POST - Add a single hiringlocations
router.post('/', function(req, res, next) {
  values = {
    id: req.body.id,
    location: req.body.name,
  };
  knex('hiring_locations').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new hiring location: ' + req.body.location));
    })
    .catch(err => { return next(err) });
});

// PUT - Update a single hiringlocations
router.put('/:hiringlocations_id', function(req, res, next) {
  values = {
    id: req.body.id,
    location: req.body.name,
  };
  knex('hiring_locations').update(values).where({ id: req.params.hiringlocations_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated hiring locations: ' + req.params.hiringlocations_id));
      } else {
        util.throwError(404, 'No hiring locations found to update');
      }
    })
    .catch(err => { return next(err) });
});

// DELETE - Delete a single hiringlocations
router.delete('/:hiringlocations_id', function(req, res, next) {
  knex('hiring_locations').del().where({ id: req.params.hiringlocations_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted hiring locations: ' + req.params.hiringlocations_id));
      } else {
        util.throwError(404, 'No hiring locations found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
