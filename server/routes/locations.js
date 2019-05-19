/* Route Prefix: /locations */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all locations
router.get('/', function(req, res, next) {
  knex('location').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No locations found');
      }
    })
    .catch(err => { return next(err) });
});
  
// GET all location names
router.get('/names', function(req, res, next) {
  knex('location').select('name')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No location names found');
      }
    })
    .catch(err => { return next(err) });
});

// POST - Add a single location 
router.post('/', function(req, res, next) {
  values = {
    name: req.body.name,
    address_id: req.body.address_id,
    description: req.body.description
  };
  knex('location').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new location: ' + req.body.name));
    })
    .catch(err => { return next(err) });
});

// PUT - Update a single location
router.put('/:location_id', function(req, res, next) {
  values = { 
    name: req.body.name,
    address_id: req.body.address_id,
    description: req.body.description
  };
  knex('location').update(values).where({ id: req.params.location_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated location: ' + req.params.location_id));
      } else {
        util.throwError(404, 'No location found to update');
      }
    })
    .catch(err => { return next(err) });
});

// DELETE - Delete a single location
router.delete('/:location_id', function(req, res, next) {
  knex('location').del().where({ id: req.params.location_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted location: ' + req.params.location_id));
      } else {
        util.throwError(404, 'No location found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
