/* Route Prefix: /events */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

//Get all users checked in to a given event
router.get('/:event_id/checkin', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT user_id FROM event_checkin WHERE event_id = \'' + event_id + '\'', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
  
});

//Get all hosts for a given event
router.get('/:event_id/host', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT host_id FROM event_host WHERE event_id = \'' + event_id + '\'', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
  
});

//Get all companies for a given event
router.get('/:event_id/companies', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT company_id FROM event_company WHERE event_id = \'' + event_id + '\'', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
  
});

//Get all categories for a given event
router.get('/:event_id/categories', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT category_id FROM event_category WHERE event_id = \'' + event_id + '\'', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
  
});

//Get all events containing term substring
router.get('/search', function(req, res, next) {
	const term = req.query.term;
  db.query('SELECT * FROM event WHERE name ILIKE \‘%<\'' + term + '\'>%\’', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
  
});

// GET events listing. 
router.get('/', function(req, res, next) {
    // TODO
});

module.exports = router;
