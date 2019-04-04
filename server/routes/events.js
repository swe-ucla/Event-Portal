/* Route Prefix: /events */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// Get all users registered to a given event
router.get('/:event_id/register', function(req, res, next) {
	const event = req.params.event_id;
	db.query('SELECT user_id FROM event_registration WHERE event_id = \'' + event + '\'', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
})

// Get all unique event locations
router.get('/locations', function(req, res, next) {
	db.query('SELECT DISTINCT location_id FROM event', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
})

// // GET all columns from test table given :id.
// router.get('/filter', function(req, res, next) {
//   const date = req.query.date;
//   const month = req.query.month;
//   const year = req.query.year;
//   const quarter = req.query.quarter;
//   const start_date = req.query.start_date;
//   const end_date = req.query.end_date;
//   const category = req.query.category;
//   const company = req.query.company;
//   const featured = req.query.featured;
//   const past = req.query.past;

//   if (date != undefined) {

//   }
// });

module.exports = router;
