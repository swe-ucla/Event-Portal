/* Route Prefix: /occupations */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all occupations
router.get('/', function(req, res, next) {
  knex('occupation').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No occupations found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a single occupation
router.post('/', function(req, res, next) {
  if (!req.body.id) {
    util.throwError(400, 'Occupation ID cannot be null');
  }

  let values = { // id populates automatically
    name: req.body.name,
    updated_at: req.body.updated_at,
    created_at: req.body.created_at
  };

  knex('occupation')
  .insert(values)
  .then(result => {
    res.send(util.message('Successfully added a single occupation'));
  })
  .catch(err => { return next(err) });
});

// Update a single occupation
router.put('/:occupation_id', function(req, res, next) {
  let occupation_id = req.params.occupation_id;
  let values = { name: req.body.name };
  knex('occupation').update(values).where({ id: occupation_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated occupation: ' + occupation_id));
      } else {
        util.throwError(404, 'No occupation found to update');
      }
    })
    .catch(err => { return next(err) });

});

// Delete a single occupation
router.delete('/:occupation_id', function(req, res, next) {
  let occupation_id = req.params.occupation_id;
  knex('occupation').del().where({ id: occupation_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted occupation: ' + occupation_id));
      } else {
        util.throwError(404, 'No occupation found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
