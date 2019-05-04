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

// Add a single position
router.post('/', function(req, res, next) {
  if (!req.query.role) {
    util.throwError(400, 'Position role must not be null');
  }
  
  knex('position').insert({ role: req.query.role })
    .then(result => {
      res.send(util.message('Successfully inserted new position: ' + req.query.role));
    })
    .catch(err => { return next(err) });
});

// Update a single position
router.put('/:position_id', function(req, res, next) {
  let errormsg = 'The following fields must not be null: ';
  let validReq = true;

  if (!req.params.position_id){
    errormsg += 'position_id, ';
    validReq = false;
  }
  if (!req.query.role){
    errormsg += 'role, ';
    validReq = false;
  }

  if (!validReq){
    util.throwError(400, errormsg.substring(0, errormsg.length - 2));
  }

  knex('position').update({ role: req.query.role }).where({ id: req.params.position_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated position: ' + req.params.position_id));
      } else {
        util.throwError(404, 'No position found to update');
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
