/* Route Prefix: /users */
var express = require('express');
var router = express.Router();


// Require database adapter file (not node-postgres directly)
const db = require('../db')

// Returns test string to verify that Users server is running.
router.get('/ping', function(req, res, next) {
  res.send('pong - Users API');
});

// GET users listing.
router.get('/', function(req, res, next) {
    db.query('SELECT id FROM swe_user', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});


//having an issue with concat
/*
//GET all user names.
router.get('/', function(req, res, next) {
    db.query('SELECT CONCAT(first_name, ' ', last_name) FROM swe_user', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});
*/


//GET all user emails.
router.get('/emails', function(req, res, next) {

    db.query('SELECT email FROM swe_user', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

 
//Get all user university IDs.
router.get('/ids', function(req, res, next) {

    db.query('SELECT university_id FROM swe_user;', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//GET all unique event locations.


router.get('/:user_id', function(req, res, next) {
  const id = req.params.user_id;
  db.query('SELECT * FROM swe_user WHERE id = user_id', [id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});





//GET all the events a user is hosting.



module.exports = router;
