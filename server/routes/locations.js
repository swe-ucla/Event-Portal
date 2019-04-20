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

module.exports = router;
