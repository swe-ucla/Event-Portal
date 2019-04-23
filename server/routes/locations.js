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

//POST - Add a single location 
router.post('/', function(req, res, next) {
  if (!req.query.id) {
    util.throwError(400, 'Location ID must not be null');
  }
  values = {
    id: req.query.id,
    name: req.query.name,
    address_id: req.query.address_id,
    description: req.query.description
  //updated_at: knex.fn.now(),
  //created_at: knex.fn.now()
  };
knex('location').insert(values)
  .then(result => {
      res.send(util.message('Successfully inserted new location: ' + req.query.id));
    })
    .catch(err => { return next(err) });
});
// knex('location')
// .insert ({
//   id: <id>,
//   name: <name>
//   address_id: <address_id>,
//   description: <description>
// });
//PUT - Update a single location
router.put('/:location_id', function(req, res, next) {
  values = { 
    id: req.query.id,
    name: req.query.name,
    address_id: req.query.address_id,
    description: req.query.description
  };
knex('location').update(values).where({ id: req.params.location_id })
.then(result => {
      if (result) {
        res.send(util.message('Successfully updated location: ' + req.params.location));
      } else {
        util.throwError(404, 'No location found to update');
      }
    })
    .catch(err => { return next(err) });
});
// knex('location').where({id: <location_id> })
// .update ({
//   id: <id>,
//   name: <name>
//   address_id: <address_id>,
//   description: <description>
// });
//DELETE - Delete a single location
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
// knex('location')
// .where({id: <location_id>})
// .del()


module.exports = router;
