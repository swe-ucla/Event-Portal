/* Route Prefix: /addresses */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all addresses
router.get('/', function(req, res, next) {
  knex('address').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No addresses found');
      }
    })
    .catch(err => { return next(err) });
});
  
// GET all address names
router.get('/names', function(req, res, next) {
  knex('address').select('name')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No address names found');
      }
    })
    .catch(err => { return next(err) });
});

// POST - Add a single address
router.post('/', function(req, res, next) {
  if (!req.body.name || !req.body.street) {
    util.throwError(400, 'Address name/street must not be null');
  }

  values = { name: req.body.name, street: req.body.street };
  knex('address').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new address: ' + req.body.id));
    })
    .catch(err => { return next(err) });
});

// PUT - Update a single address
router.put('/:address_id', function(req, res, next) {
  values = { name: req.body.name, street: req.body.street };
  knex('address').update(values).where({ id: req.params.address_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated address: ' + req.params.address_id));
      } else {
        util.throwError(404, 'No address found to update');
      }
    })
    .catch(err => { return next(err) });
});

// Delete a single address
router.delete('/:address_id', function(req, res, next) {
  knex('address').del().where({ id: req.params.address_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted address: ' + req.params.address_id));
      } else {
        util.throwError(404, 'No address found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
