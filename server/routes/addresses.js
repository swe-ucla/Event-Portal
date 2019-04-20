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

module.exports = router;
