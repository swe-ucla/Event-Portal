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

// Delete a single position
router.delete('/positions/:position_id', function(req, res, next) {
  const position_id = req.params.position_id;
  knex('position').del().where({ id: position_id, }).then(result => {
    if (result) {
      res.send(util.message('Successfully deleted position with position id ' + position_id));
    } else {
      util.throwError(404, 'No position found to delete');
    }
  })
  .catch(err => { return next(err) });
});

module.exports = router;
