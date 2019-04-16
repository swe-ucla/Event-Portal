/* Route Prefix: /users */
var express = require('express');
var router = express.Router();


// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET test string to verify that Users server is running.
router.get('/ping', function(req, res, next) {
  res.send('pong - Users API');
});

// GET users listing.
router.get('/', function(req, res, next) {
  db.query('SELECT id FROM swe_user', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all user names.
router.get('/names', function(req, res, next) {
  db.query('SELECT CONCAT(first_name, \' \', last_name) FROM swe_user', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all user emails.
router.get('/emails', function(req, res, next) {
  db.query('SELECT email FROM swe_user', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});
 
// GET all user university IDs.
router.get('/ids', function(req, res, next) {
  db.query('SELECT university_id FROM swe_user;', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET user info by user_id
router.get('/:user_id/id', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT * FROM swe_user WHERE id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET whether user is admin or not
router.get('/:user_id/admin', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT is_admin FROM swe_user WHERE id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET a user's past events-HELP NEEDED
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
  db.query('SELECT company_id, rank FROM user_company_rank WHERE user_id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
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
  db.query('SELECT event_id FROM event_host WHERE host_id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all the user's majors
router.get('/:user_id/majors', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT major_id FROM user_major WHERE user_id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all positions a user is seeking
router.get('/:user_id/positions', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT position_id FROM user_position WHERE user_id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all the user's occupations
router.get('/:user_id/occupations', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT occupation_id FROM user_occupation WHERE user_id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET the user's diet information
router.get('/:user_id/diet', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT diet_id FROM user_diet WHERE user_id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET a user's favorite events
router.get('/:user_id/favorite', function(req, res, next) {
  const user_id = req.params.user_id;
  db.query('SELECT event_id FROM favorite_events WHERE user_id = $1', [id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});


router.get('/search', function(req, res, next) {
  const name = req.query.name;
  const email = req.query.email;
  // GET a user's favorite events
  if (email){
	  db.query('SELECT id FROM swe_user WHERE email ILIKE $1', ['%' + email + '%'], (err, result) => {
	    if (err) return next(err);
	    res.send(result.rows);
	  });
  }
  if (name){
	  db.query('SELECT id FROM swe_user WHERE CONCAT(first_name, \' \', last_name) ILIKE $1', ['%' + name + '%'], (err, result) => {
	    if (err) return next(err);
	    res.send(result.rows);
	  });
  }
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
