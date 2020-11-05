/* Route Prefix: /years */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all years
router.get('/', function(req, res, next) {
  knex('years').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No years found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a single years
router.post('/', function(req, res, next) {
  if (!req.body.name) {
    util.throwError(400, "Missing 'year' parameter.");
  }

  knex('years').insert({ name: req.body.name })
    .then(result => {
      res.send(util.message('Successfully inserted new years: ' + req.body.name));
    })
    .catch(err => { return next(err) });
});

// Update a single years
router.put('/:year_id', function(req, res, next) {
  if (!req.params.years_id){
    util.throwError(400, "Missing 'year_id' parameter.");
  }
  if (!req.body.name){
    util.throwError(400, "Missing 'name' parameter.");
  }

  knex('years').update({ name: req.body.name }).where({ id: req.params.year_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated years: ' + req.params.year_id));
      } else {
        util.throwError(404, 'No years found to update');
      }
    })
    .catch(err => { return next(err) });
});

// Delete a single years
router.delete('/years/:year_id', function(req, res, next) {
  const years_id = req.params.year_id;
  knex('years').del().where({ id: year_id, })
  .then(result => {
    if (result) {
      res.send(util.message('Successfully deleted years with year id ' + year_id));
    } else {
      util.throwError(404, 'No years found to delete');
    }
  })
  .catch(err => { return next(err) });
});

module.exports = router;
