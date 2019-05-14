/* Route Prefix: /diet */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all diets
router.get('/', function(req, res, next) {
  knex('diet').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No diets found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a single diet
router.post('/', function(req, res, next) {
  if (!req.body.type) {
    util.throwError(400, 'Diet type must not be null');
  }
  
  values = { type: req.body.type };
  knex('diet').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new diet: ' + req.body.type));
    })
    .catch(err => { return next(err) });
});

// Update a single diet
router.put('/:diet_id', function(req, res, next) {
  values = { type: req.body.type };
  knex('diet').update(values).where({ id: req.params.diet_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated diet: ' + req.params.diet_id));
      } else {
        util.throwError(404, 'No diet found to update');
      }
    })
    .catch(err => { return next(err) });
});

// Delete a single major
router.delete('/:diet_id', function(req, res, next) {
  knex('diet').del().where({ id: req.params.diet_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted diet: ' + req.params.diet_id));
      } else {
        util.throwError(404, 'No diet found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
