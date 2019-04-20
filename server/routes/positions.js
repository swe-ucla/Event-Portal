/* Route Prefix: /positions */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all positions
router.get('/', function(req, res, next) {
  knex('position').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No positions found');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
