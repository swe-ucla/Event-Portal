import parallel from 'async/parallel';

//* Route Prefix: /events */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all columns from test table given :id.
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

  // only end_date; current day is default
  // past specifier - (month, year, quarter)
  // quarter - default year is current year

  // separate into blocks (each block is an AND should be a category type)
  // category/company gets its own block, etc. etc.
  // look up how to build queries (AND RELATIONSHIP)

  // date > month > year > quarter

  // example: 2018-10-19

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

  if (date != undefined)
  {
  	db.query('SELECT fb_id FROM event WHERE date(starts_at) <= \'' + date + '\' AND \'' + date + '\' <= date(ends_at)',[], (err, result) => {
    	if (err) {
      	  return next(err);
    	}
    	res.send(result.rows);
 	});
  } else if (month != undefined) {
  	db.query('SELECT * FROM event WHERE EXTRACT(MONTH FROM starts_at) = \'' + month +'\' OR EXTRACT(MONTH FROM ends_at) = \'' + month + '\'', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	});
  } else if (year != undefined) {
  	db.query('SELECT * FROM event WHERE EXTRACT(YEAR FROM starts_at) = \'' + year + '\' OR EXTRACT(YEAR FROM ends_at) = \'' + year + '\'', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	})
  } else if (quarter != undefined) {
  	db.query('SELECT fb_id FROM event WHERE quarter = \'' + quarter + '\'', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	})
  } else if (start_date != undefined) {
  	db.query('SELECT fb_id FROM event WHERE date(starts_at) = \'' + start_date + '\'', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	})
  } else if (end_date != undefined) {
  	db.query('SELECT fb_id FROM event WHERE date(starts_at) = \'' + end_date + '\'', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	})
  } else if (category != undefined) {
  	db.query('SELECT event_id FROM event_category WHERE category_id = \'' + category_id + '\'', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	})
  } else if (company != undefined) {
  	db.query('SELECT event_id FROM event_company WHERE company_id = \'' + company + '\'', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	})
  } else if (featured != undefined) {
  	db.query('SELECT * FROM event WHERE is_featured = \'' + featured + '\'', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	})
  } else if (past != undefined) {
  	db.query('SELECT fb_id FROM event WHERE ends_at < now()', [], (err, result) => {
  		if (err) {
  			return next(err);
  		}
  		res.send(result.rows);
  	})
  } else {
  	res.json({result: false}); // error message
  }
});

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

//Get all events containing term substring
//I think this needs to go before all of the /:event_id, or else it interprets search as an event id :/
//also I can't figure out how to use the [] for this one :(
router.get('/search', function(req, res, next) {
	const term = req.query.term;
	
    db.query('SELECT * FROM event WHERE name ILIKE \'%' + term + '%\'', [], (err, result) => {
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
	db.query('SELECT * FROM event WHERE fb_id = $1', [event_id], (err, result) => {
		if (err) {
			return next(err);
		}
		res.send(result.rows);
	});
});

// Get all users that have favorited the given event
router.get('/:event_id/favorites', function(req, res, next) {
	const event_id = req.params.event_id;
	db.query('SELECT user_id FROM favorite_events WHERE event_id = $1', [event_id], (err, result) => {
		if (err) {
			return next(err);
		}
		res.send(result.rows);
	});
});

// Get all users registered to a given event
router.get('/:event_id/register', function(req, res, next) {
	const event_id = req.params.event_id;
	const paid = req.query.paid;
	if (paid == undefined){
		db.query('SELECT user_id FROM event_registration WHERE event_id = $1', [event_id], (err, result) => {
			if (err) {
        		return next(err);
    		}
    		res.send(result.rows);
  		});
	}
	else{
		db.query('SELECT user_id FROM event_registration WHERE event_id = $1 AND has_paid = $2', [event_id, paid], (err, result) => {
			if (err) {
        		return next(err);
    		}
    		res.send(result.rows);
  		});
	}
});

// Get all users that registered and have paid or not paid for a given event
/*
router.get('/:event_id/register', function(req, res, next) {
	const event_id = req.params.event_id;
	const paid = req.query.paid;
	db.query('SELECT user_id FROM event_registration WHERE event_id = $1 AND has_paid = $2', [event_id, paid], (err, result) => {
		if (err) {
        	return next(err);
    	}
    	res.send(result.rows);
  	});
  	res.send(paid);
});

*/

//Get all users checked in to a given event
router.get('/:event_id/checkin', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT user_id FROM event_checkin WHERE event_id = $1', [event_id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//Get all hosts for a given event
router.get('/:event_id/host', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT host_id FROM event_host WHERE event_id = $1', [event_id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//Get all companies for a given event
router.get('/:event_id/companies', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT company_id FROM event_company WHERE event_id = $1', [event_id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//Get all categories for a given event
router.get('/:event_id/categories', function(req, res, next) {
  const event_id = req.params.event_id;
  db.query('SELECT category_id FROM event_category WHERE event_id = $1', [event_id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

module.exports = router;