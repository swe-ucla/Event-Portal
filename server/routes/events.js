//* Route Prefix: /events */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// Get all events
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM event', [], (err, result) => {
    	if (err) {
      	  return next(err);
    	}
    	res.send(result.rows);
  	});
});

// Get all event names
// NOTE: chose to SELECT fb_id instead of name
router.get('/names', function(req, res, next) {
  db.query('SELECT fb_id FROM event', [], (err, result) => {
    	if (err) {
      	  return next(err);
    	}
    	res.send(result.rows);
  	});
});

// Get all unique event locations
router.get('/locations', function(req, res, next) {
	db.query('SELECT DISTINCT location_id FROM event', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// Get event by event_id
router.get('/:event_id', function(req, res, next) {
	const event_id = req.params.event_id;
	db.query('SELECT * FROM event WHERE fb_id = \'' + event_id + '\'', [], (err, result) => {
		if (err) {
			return next(err);
		}
		res.send(result.rows);
	});
});

// Get all users that have favorited the given event
router.get('/:event_id/favorites', function(req, res, next) {
	const event_id = req.params.event_id;
	db.query('SELECT user_id FROM favorite_events WHERE event_id = \'' + event_id + '\'', [], (err, result) => {
		if (err) {
			return next(err);
		}
		res.send(result.rows);
	});
});

// Get all users registered to a given event
router.get('/:event_id/register', function(req, res, next) {
	const event_id = req.params.event_id;
	db.query('SELECT user_id FROM event_registration WHERE event_id = \'' + event_id + '\'', [], (err, result) => {
		if (err) {
        	return next(err);
    	}
    	res.send(result.rows);
  	});
});

// Get all users that registered and have paid or not paid for a given event
router.get('/:event_id/register', function(req, res, next) {
	const event_id = req.params.event_id;
	const paid = req.query.paid;
	db.query('SELECT user_id FROM event_registration WHERE event_id = \'' + event_id + '\' AND has_paid = \'' + paid + '\'', [], (err, result) => {
		if (err) {
        	return next(err);
    	}
    	res.send(result.rows);
  	});
});

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
  db.query('SELECT * FROM event WHERE name ILIKE \'%' + term + '%\'', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
  
});

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

 // db.query('SELECT fb_id FROM event WHERE date(starts_at) <= \'' + date + '\' AND \'' + date + '\' <= date(ends_at)', [], (err, result) => {
 //    if (err) {
 //        return next(err);
 //    }
 //    res.send(result.rows);
 //  });
// });


module.exports = router;