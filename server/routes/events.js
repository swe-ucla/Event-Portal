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
      res.status(404).json('No event names found.');
    }
  })
  .catch(err => { return next(err) });
});

// GET all unique event locations
router.get('/locations', function(req, res, next) {
  knex('event').select('location_id')
  .then(result => {
    if(result.length) {
      res.json(result);
    } else {
      res.status(404).json('No event locations found.')
    }
  })
});

// GET event by event_id
router.get('/:event_id/id', function(req, res, next) {
  const event_id = req.params.event_id;
  knex('event').select()
  .where({ fb_id: event_id })
  .then(result => {
    if(result.length) {
      res.json(result);
    } else {
      res.status(404).json('No events matching event_id = ' + event_id + ' found.');
    }
  })
  .catch(err => { return next(err) });
});

// Add a single event
router.post('/', function(req, res, next) {
  let values = { 
  	fb_id: req.body.event_id, 
  	name: req.body.name, 
  	starts_at: req.body.starts_at, 
  	ends_at: req.body.ends_at,
  	quarter: req.body.quarter,
  	location_id: req.body.location_id,
  	description: req.body.description,
  	fb_event: req.body.fb_event,
  	picture: req.body.picture,
  	is_featured: req.body.is_featured
  };

  Object.keys(values).forEach(function(key) {
  	if (!values[key]) {
  		if (key == 'fb_id'){
  			util.throwError(400, "Missing 'event_id' parameter.");
  		}
  		else{
  			util.throwError(400, "Missing '" + key + "' parameter.");
  		}
  	}
	});

  let category_ids = req.body.categories;
  let category_values = [];
  let company_ids = req.body.companies;
	let company_values = [];
	let host_ids = req.body.hosts;
  let host_values = [];

  if (!category_ids){
  	util.throwError(400, "Missing 'categories' parameter.");
  } 
  category_ids.forEach(function(entry) {
  	category_values.push({ event_id: req.body.event_id, category_id: entry });
  });

  if (!company_ids){
  	util.throwError(400, "Missing 'companies' parameter.");	
		
	}
	company_ids.forEach(function(entry) {
		company_values.push({ event_id: req.body.event_id, company_id: entry });
	});

  if (!host_ids){
  	util.throwError(400, "Missing 'hosts' parameter.");
	}
  host_ids.forEach(function(entry) {
  	host_values.push({ event_id: req.body.event_id, host_id: entry });
  });

  var events_query = knex('event').insert(values);
  var category_query = knex('event_category').insert(category_values);
  var company_query = knex('event_company').insert(company_values);
  var host_query = knex('event_host').insert(host_values);

	knex.transaction(function(trx) {
		return events_query.transacting(trx)
			.then(async function() {
				await category_query.transacting(trx);
				await company_query.transacting(trx);
				await host_query.transacting(trx);
				return trx.commit;
			})
	})
	.then(function() {
		res.send(util.message('Successfully inserted new event: ' + req.body.name));
	})
	.catch(err => { return next(err) });
});

// Updated a single event by event_id
router.put('/:event_id', function(req, res, next) {
	const event_id = req.params.event_id;
	let validReqForEvent = false;

	let values = {
  	name: req.body.name, 
  	starts_at: req.body.starts_at, 
  	ends_at: req.body.ends_at,
  	quarter: req.body.quarter,
  	location_id: req.body.location_id,
  	description: req.body.description,
  	fb_event: req.body.fb_event,
  	picture: req.body.picture,
  	is_featured: req.body.is_featured
  };

  let category_ids = req.body.categories;
	let category_values = [];
  let company_ids = req.body.companies;
	let company_values = [];
  let host_ids = req.body.hosts;
  let host_values = [];

  if (category_ids){
	  category_ids.forEach(function(entry) {
	  	category_values.push({ event_id: event_id, category_id: entry });
	  });
	}

  if (company_ids){
	  company_ids.forEach(function(entry) {
	  	company_values.push({ event_id: event_id, company_id: entry });
	  });
	}

  if (host_ids){
	  host_ids.forEach(function(entry) {
	  	host_values.push({ event_id: event_id, host_id: entry });
	  });
	}

	let remove_category_ids = req.body.remove_categories;
	let remove_company_ids = req.body.remove_companies;
  let remove_host_ids = req.body.remove_hosts;

  Object.keys(values).forEach(function(key) {
  	if (!validReqForEvent && values[key]) {
  		validReqForEvent = true;
  	}
	});

	var event_query = knex('event').modify(function(queryBuilder) {
		if (validReqForEvent){
			queryBuilder.where({ fb_id: event_id }).update(values);
		}
	});

	var remove_category_query = knex('event_category').modify(function(queryBuilder) {
		if (remove_category_ids){
			queryBuilder.where({ event_id: event_id })
				.andWhere((builder) =>
					builder.whereIn('category_id', remove_category_ids)
				)
				.del();
		}
	});

	var remove_host_query = knex('event_host').modify(function(queryBuilder) {
		if (remove_host_ids){
			queryBuilder.where({ event_id: event_id })
				.andWhere((builder) =>
					builder.whereIn('host_id', remove_host_ids)
				)
				.del();
		}
	});

	var remove_company_query = knex('event_company').modify(function(queryBuilder){
		if (remove_company_ids){
			queryBuilder.where({ event_id: event_id })
				.andWhere((builder) =>
					builder.whereIn('company_id', remove_company_ids)
				)
				.del();
		}
	});

	var category_query = knex('event_category').insert(category_values);
	var host_query = knex('event_host').insert(host_values);
	var company_query = knex('event_company').insert(company_values);

	knex.transaction(function(trx) {
		return event_query.transacting(trx)
			.then(async function() {
				await category_query.transacting(trx);
				await remove_category_query.transacting(trx);
				await host_query.transacting(trx);
				await remove_host_query.transacting(trx);
				await company_query.transacting(trx);
				await remove_company_query.transacting(trx);
				return trx.commit;
			})
	})
	.then(function() {
  	res.send(util.message('Successfully updated event_id: ' + event_id));
  })
  .catch(err => { return next(err) });
});



// Delete an event by event_id
router.delete('/:event_id', function(req, res, next) {
  const event_id = req.params.event_id;
  knex('event').del().where({ fb_id: event_id, }).then(result => {
    if (result) {
      res.send(util.message('Successfully deleted event with event_id ' + event_id));
    } else {
      util.throwError(404, 'No event found to delete');
    }
  })
  .catch(err => { return next(err) });
});

// GET all users that have favorited the given event
router.get('/:event_id/favorites', function(req, res, next) {
  const event_id = req.params.event_id;
  knex('favorite_events').select('user_id')
  .where({ event_id: event_id })
  .then(result => {
    if(result.length) {
      res.json(result);
    } else {
      res.status(404).json('No events where fb_id = ' + event_id + ' found.');
    }
  })
});

// Update user registration for a given event
router.put('/:event_id/register/:user_id', function(req, res, next) {
  const event_id = req.params.event_id;
  const user_id = req.params.user_id;
  const paid = req.body.paid;
  knex('event_registration')
  .update({ 
    has_paid: paid
  })
  .where({ 
    event_id: event_id, 
    user_id: user_id
  })
  .then(result => {
    if (result) {
      res.send(util.message('Successfully updated user registration for event with event_id ' + event_id));
    } else {
      util.throwError(404, 'No user found with user_id ' + user_id + ' for event with event_id ' + event_id);
    }
  })
  .catch(err => { return next(err) });
});

// GET all users registered and have paid or not paid for a given event
router.get('/:event_id/register', function(req, res, next) {
  const event_id = req.params.event_id;
  const paid = req.query.paid;
  if (!paid || paid == "true" || paid == "false") {
    knex('event_registration').select('user_id')
    .where({ 
      event_id: event_id,
      has_paid: paid
    })
    .then(result => {
      if(result.length) {
        res.json(result);
      } else {
        res.status(404).json('No events where fb_id = ' + event_id + ' found.');
      }
    })
  } else {
    return res.status(400).send({
      message: '\'paid\' is not a boolean'
    });
  }
});

// Register a user for a given event
router.post('/:event_id/register/:user_id', function(req, res, next) {
  const event_id = req.params.event_id;
  const user_id = req.params.user_id;
  const paid = req.query.paid;
  if (!req.query.paid) {
    util.throwError(400, 'Paid query must not be null');
  }
  knex('event_registration')
  .insert({
    event_id: event_id, 
    user_id: user_id, 
    has_paid: paid
  })
  .then(result => {
    res.send(util.message('Successfully registered user with user_id ' + user_id + ' for event with event_id ' + event_id));
  })
  .catch(err => { return next(err) });
});

// DELETE user registration for an event
router.delete('/:event_id/register/:user_id', function(req, res, next) {
  const event_id = req.params.event_id;
  const user_id = req.params.user_id;
  knex('event_registration').del()
    .where({ 
      event_id: event_id,
      user_id: user_id
    })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted user registration for event_id = ' + event_id));
      } else {
        util.throwError(404, 'No registered users found to delete with user_id = ' + user_id + ' and event_id = ' + event_id);
      }
    })
    .catch(err => { return next(err) });
});

// GET all users checked in to a given event
router.get('/:event_id/checkin', function(req, res, next) {
  const event_id = req.params.event_id;
  knex('event_checkin').select('user_id').where({event_id: event_id})
  .then(result => {
  	if(result.length) {
      res.json(result);
    } else {
      res.status(404).json('No checked in users found for event_id = ' + event_id + '.');
    }
  });
});

// Check in a user for an event
router.post('/:event_id/checkin/:user_id', function(req, res, next) {
  const event_id = req.params.event_id;
  const user_id = req.params.user_id;
  knex('event_checkin').insert({
      event_id: event_id,
      user_id: user_id
    })
    .then(result => {
      res.send(util.message('Successfully checked in user with user_id = ' + user_id + ' and event_id = ' + event_id + ' for event'));
    })
    .catch(err => { return next(err) });
});

// DELETE check in for a user for an event
router.delete('/:event_id/checkin/:user_id', function(req, res, next) {
  const event_id = req.params.event_id;
  const user_id = req.params.user_id;
  knex('event_checkin').del().where({
      event_id: event_id,
      user_id: user_id
    })
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted user check in for user with user_id = ' + user_id + ' and event_id = ' + event_id));
      } else {
        util.throwError(404, 'No user check in found to delete');
      }
    })
    .catch(err => { return next(err) });
});

// GET all hosts for a given event
router.get('/:event_id/host', function(req, res, next) {
  const event_id = req.params.event_id;
  knex('event_host').select('host_id').where({event_id: event_id})
  .then(result => {
    if(result.length) {
      res.json(result);
    } else {
      res.status(404).json('No event hosts for event_id = ' + event_id + '.');
    }
  });
});

// GET all companies for a given event
router.get('/:event_id/companies', function(req, res, next) {
  const event_id = req.params.event_id;
  knex('event_company').where('event_id', event_id).select('company_id')
  .then(result => {
  	if (result.length) {
  		res.json(result);
  	} else {
  		res.status(404).json('No companies found for event_id = ' + event_id + '.');
  	}
  })
  .catch(err => { return next(err) });
});

// GET all categories for a given event
router.get('/:event_id/categories', function(req, res, next) {
  const event_id = req.params.event_id;
  knex('event_category').where('event_id', event_id).select('category_id')
  .then(result => {
  	if (result.length) {
  		res.json(result);
  	} else {
  		res.status(404).json('No categories found for event_id = ' + event_id + '.');
  	}
  })
  .catch(err => { return next(err) });
});

// GET all events containing term substring
router.get('/search', function(req, res, next) {
  const term = req.query.term;
  if (term == undefined){
    return res.status(400).send({
      message: '\'term\' is undefined'
    });
  }
  else {
    knex('event').where('name', 'ilike', `%${term}%`).select()
    .then(result => {
    	if (result.length) {
    		res.json(result);
    	} else {
    		res.status(404).json('No events found for substring for event_id = ' + event_id + '.');
    	}
    })
    .catch(err => { return next(err) });
}});

/*
from katrina:

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
