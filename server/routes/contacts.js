/* Route Prefix: /contacts */
var express = require('express');
var router = express.Router();

// Require database connection
var knex = require('../db/knex');
var util = require('../util');

// GET all contacts
router.get('/', function(req, res, next) {
  knex('contact').select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No contacts found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a single contact
router.post('/', function(req, res, next) {
  if (!req.body.first_name || !req.body.last_name || !req.body.email) {
    util.throwError(400, 'First/last name and email fields must not be null');
  }
  
  values = { 
    first_name: req.body.first_name, 
    last_name: req.body.last_name, 
    email: req.body.email, 
    phone: req.body.phone, 
    misc: req.body.misc 
  };
  knex('contact').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new contact: ' + req.body.first_name + ' ' + req.body.last_name));
    })
    .catch(err => { return next(err) });
});

// Update a single contact
router.put('/:contact_id', function(req, res, next) {
  values = { 
    first_name: req.body.first_name, 
    last_name: req.body.last_name, 
    email: req.body.email, 
    phone: req.body.phone, 
    misc: req.body.misc 
  };
  knex('contact').update(values).where({ id: req.params.contact_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully updated contact: ' + req.params.contact_id));
      } else {
        util.throwError(404, 'No contact found to update');
      }
    })
    .catch(err => { return next(err) });
});

// Delete a single contact
router.delete('/:contact_id', function(req, res, next) {
  knex('contact').del().where({ id: req.params.contact_id })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted contact: ' + req.params.contact_id));
      } else {
        util.throwError(404, 'No contact found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;
