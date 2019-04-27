/* Route Prefix: /users */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')
var knex = require('../db/knex');
var util = require('../util');

// GET test string to verify that Users server is running.
router.get('/ping', function(req, res, next) {
  res.send('pong - Users API');
});

//GET all users.
router.get('/', function(req, res, next) {
  knex('swe_user').select('id')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all user names. - TODO: fix concat
router.get('/names', function(req, res, next) {
  knex('swe_user').select('first_name', 'last_name')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No names found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all user emails.
router.get('/emails', function(req, res, next) {
  knex('swe_user').select('email')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No names found');
      }
    })
    .catch(err => { return next(err) });
});
 
// GET all user university IDs.
router.get('/ids', function(req, res, next) {
  knex('swe_user').select('university_id')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No names found');
      }
    })
    .catch(err => { return next(err) });
});

//Add a user
router.get('/:user_id/id', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('swe_user').select()
  .where( {id: user_id} )
  .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + user_id + ' found');
      }
    })
    .catch(err => { return next(err) 
  });
});
  
/*
//Login a user
router.post('/register', function(req, res, next) {
  values =
  {
    id: req.query.id,
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    password: req.query.password,
    email: req.query.email,
    phone: req.query.phone,
    university_id: req.query.university_id,
    is_admin: req.query.is_admin,
    update_at: now(),
    created_at: now()
  }
  knex('swe_user').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new user: ' + req.query.name));
    })
    .catch(err => { return next(err) });
});
*/


// GET user info by user_id
router.get('/:user_id/id', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('swe_user').select()
  .where( {id: user_id} )
  .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + user_id + ' found');
      }
    })
    .catch(err => { return next(err) 
  });
});

// GET whether user is admin or not
router.get('/:user_id/admin', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('swe_user').select('is_admin')
  .where({id: user_id})
  .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + user_id + ' found');
      }
    })
    .catch(err => { return next(err) 
  });
});

//Update user info

// GET a user's past events
//TO DO: convert to knex (Nikhita)
router.get('/:user_id/past', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT event_id FROM event_checkin INNER JOIN event ON event_checkin.event_id = event.fb_id \
  WHERE event_checkin.user_id = 3 AND event.ends_at < now() UNION SELECT event_id FROM event_registration\
  INNER JOIN event ON event_registration.event_id = event.fb_id WHERE event_registration.user_id = 3 \
  AND event.ends_at < now()', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all companies a user is interested in 
router.get('/:user_id/companies', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('user_company_rank').select('company_id', 'rank')
  .where({user_id: user_id})
  .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + user_id + ' found');
      }
    })
    .catch(err => { return next(err) 
  });
});

// GET all events a user is attending
router.get('/:user_id/events', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT event_id FROM event_checkin WHERE user_id = $1 UNION SELECT event_id FROM event_registration \
  WHERE user_id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all events a user is hosting
router.get('/:user_id/host', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT event_id FROM event_host WHERE host_id = $1', [user_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all the user's majors
router.get('/:user_id/majors', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT major_id FROM user_major WHERE user_id = $1', [user_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all positions a user is seeking
router.get('/:user_id/positions', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT position_id FROM user_position WHERE user_id = $1', [user_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all the user's occupations
router.get('/:user_id/occupations', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT occupation_id FROM user_occupation WHERE user_id = $1', [user_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET the user's diet information
router.get('/:user_id/diet', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT diet_id FROM user_diet WHERE user_id = $1', [user_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET a user's favorite events
router.get('/:user_id/favorite', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT event_id FROM favorite_events WHERE user_id = $1', [user_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

//Add a favorite event to a user

//Delete a favorite event from a user

// GET a user's favorite events
router.get('/search', function(req, res, next) {
  const name = req.query.name;
  db.query('SELECT id FROM swe_user WHERE CONCAT(first_name, \' \', last_name) ILIKE $1', ['%' + name + '%'], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// TODO: Add Postman Request
router.get('/search', function(req, res, next) {
  const email = req.query.email;
  db.query('SELECT id FROM swe_user WHERE email ILIKE $1', ['%' + email + '%'], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

//TODO: Fix Filter Logic
router.get('/filter', function(req, res, next) {
  const cid = req.query.cid;
  const oid = req.query.oid;
  const mid = req.query.mid;
  const pid = req.query.pid;
  const admin = req.query.admin;
  // GET all users interested in a given company.
  if (cid){
    db.query('SELECT user_id FROM user_company_rank WHERE company_id = $1', [cid], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
 }

 // GET all users of the given occupation
 if (oid){
    db.query('SELECT user_id FROM user_occupation WHERE occupation_id = $1', [oid], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
 }

 // GET all users of the given major
 if (mid){
    db.query('SELECT user_id FROM user_major WHERE major_id = $1', [mid], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
 }

 // GET all users seeking the given position
 if (pid){
    db.query('SELECT user_id FROM user_position WHERE position_id = $1', [pid], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
 }

// GET all admin users
 if (admin){
    db.query('SELECT id FROM swe_user WHERE is_admin = $1', [admin], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
   });
 }
});

module.exports = router;
