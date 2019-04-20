/* Route Prefix: /events */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
var knex = require('../db/knex');
var util = require('../util');

// Returns test string to verify that Events server is running. 
router.get('/ping', function(req, res, next) {
  res.send('pong - Events API');
});

// GET all events
router.get('/', function(req, res, next) {
  knex('event').select()
  .then(result => {
    if (result.length) {
      res.json(result);
    } else {
      res.status(404).json('No events found.');
    }
  })
  .catch(err => { return next(err) });
});

// GET all event names
router.get('/names', function(req, res, next) {
  knex('event').select('fb_id, name')
  .then(result => {
    if(result.length) {
      res.json(result);
    } else {
      res.status(404.json('No event names found.'));
    }
  })
  .catch(err => { return next(err) });
});

// GET all unique event locations
router.get('/locations', function(req, res, next) {
  db.query('SELECT DISTINCT location_id FROM event', [], (err, result) => {
  	if (err) return next(err);
    res.send(result.rows);
  });
});

// GET event by event_id
router.get('/:event_id/id', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT * FROM event WHERE fb_id = $1', [event_id], (err, result) => {
		if (err) return next(err);
  	res.send(result.rows);
  });
});

// GET all users that have favorited the given event
router.get('/:event_id/favorites', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT user_id FROM favorite_events WHERE event_id = $1', [event_id], (err, result) => {
		if (err) return next(err);
  	res.send(result.rows);
  });
});

// GET all users registered and have paid or not paid for a given event
router.get('/:event_id/register', function(req, res, next) {
  const event_id = req.params.event_id;
  const paid = req.query.paid;
  if (paid == undefined) {
		db.query('SELECT user_id FROM event_registration WHERE event_id = $1', [event_id], (err, result) => {
	  	if (err) return next(err);
    	res.send(result.rows);
  	});
  } else if (paid == "true" || paid == "false") {
		db.query('SELECT user_id FROM event_registration WHERE event_id = $1 AND has_paid = $2', [event_id, paid], (err, result) => {
			if (err) return next(err);
      res.send(result.rows);
  	});
  } else {
    return res.status(400).send({
      message: '\'paid\' is not a boolean'
    });
  }
});

// GET all users checked in to a given event
router.get('/:event_id/checkin', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT user_id FROM event_checkin WHERE event_id = $1', [event_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all hosts for a given event
router.get('/:event_id/host', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT host_id FROM event_host WHERE event_id = $1', [event_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all companies for a given event
router.get('/:event_id/companies', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT company_id FROM event_company WHERE event_id = $1', [event_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all categories for a given event
router.get('/:event_id/categories', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT category_id FROM event_category WHERE event_id = $1', [event_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all events containing term substring
router.get('/search', function(req, res, next) {
  const term = req.query.term;
  if (term == undefined){
    return res.status(400).send({
      message: '\'term\' is undefined'
    });
  }
  else{
    db.query('SELECT * FROM event WHERE name ~* $1', [term], (err, result) => {
      if (err) return next(err);
    	res.send(result.rows);
    });
  }
});

/* from katrina:

One thing to note when implementing the API is all queries under the same route (/events/filter) will be under the same function. You'll need to check whether or not a query parameter exists and filter by it. It's a bit complex, but there's an AND OR relationship between some of these filters.

e.g. if date= is set, and so is month=, then its date OR month because it wouldn't make sense to answer both queries. Here date is more specific, so do date

e.g. month= and year= are set. They work together, so it's month AND year

generally filters of the similar type/category form an OR relationship while filters of different types/topics form AND relationships. aka "when" filters (date/time related) form OR relationships between each other, but "when" filters have an AND relationship with category, company, and featured
*/

/* alternative syntax for queries using async/await: 
    (https://node-postgres.com)
  
  try {
    const res = await db.query(...,[]);
    res.send(result.rows);
  } catch(err) {
    return next(err);
  }

  using promises:
  db.query(...,[])
    .then(res => {
      res.send(result.rows);
    })
  .catch(return next(err));
*/

// GET all columns from test table given :id.
// TODO: fix filtering logic
router.get('/filter', function(req, res, next) {
  const date = req.query.date;
  const month = req.query.month;
  const year = req.query.year;
  const quarter = req.query.quarter;
  const start_date = req.query.start_date;
  const end_date = req.query.end_date;
  const category = req.query.category;
  const company = req.query.company;
  const featured = req.query.featured;
  const past = req.query.past;

  // example: 2018-10-19
  if (date != undefined)
  {
    let query = 'SELECT fb_id FROM event WHERE';
    db.query('SELECT fb_id FROM event WHERE date(starts_at) <= \'' + date + '\' AND \'' + date + '\' <= date(ends_at)',[], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
   	});
  } else if (month != undefined) {
    db.query('SELECT * FROM event WHERE EXTRACT(MONTH FROM starts_at) = \'' + month +'\' OR EXTRACT(MONTH FROM ends_at) = \'' + month + '\'', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (year != undefined) {
    db.query('SELECT * FROM event WHERE EXTRACT(YEAR FROM starts_at) = \'' + year + '\' OR EXTRACT(YEAR FROM ends_at) = \'' + year + '\'', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (quarter != undefined) {
    db.query('SELECT fb_id FROM event WHERE quarter = \'' + quarter + '\'', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (start_date != undefined) {
    db.query('SELECT fb_id FROM event WHERE date(starts_at) = \'' + start_date + '\'', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (end_date != undefined) {
    db.query('SELECT fb_id FROM event WHERE date(starts_at) = \'' + end_date + '\'', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (category != undefined) {
    db.query('SELECT event_id FROM event_category WHERE category_id = \'' + category_id + '\'', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (company != undefined) {
    db.query('SELECT event_id FROM event_company WHERE company_id = \'' + company + '\'', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (featured != undefined) {
    db.query('SELECT * FROM event WHERE is_featured = \'' + featured + '\'', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (past != undefined) {
    db.query('SELECT fb_id FROM event WHERE ends_at < now()', [], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else {
    res.json({result: false}); // error message
  }
});

module.exports = router;