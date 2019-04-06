/* Route Prefix: /companies */
var express = require('express');
var router = express.Router();

const db = require('../db')

// Returns test string to verify that Companies server is running.
router.get('/ping', function(req, res, next) {
  res.send('pong - Companies API');
});

//Get all companies' info
router.get('/', function(req, res, next) {
  db.query('SELECT id FROM company;', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//Get all company names
router.get('/names', function(req, res, next) {
  db.query('SELECT id, name FROM company ORDER BY name;', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//Get all company names and logos
router.get('/logos', function(req, res, next) {
  db.query('SELECT id, name, logo FROM company ORDER BY name;', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// Get all company names, logos, and websites
router.get('/websites', function(req, res, next) {
  db.query('SELECT id, name, logo, website FROM company ORDER BY name;', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//Get company info by company_id
router.get('/:company_id', function(req, res, next) {
  const id = req.params.company_id;
  db.query('SELECT * FROM company WHERE id = $1;', [id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//Get all events associated with a given company
router.get('/:company_id/events', function(req, res, next) {
  const id = req.params.company_id;
  db.query('SELECT * FROM event_company WHERE company_id= $1;', [id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

//Get all companies hiring a specific major
router.get('/filter', function(req, res, next) {
	res.send('hello');
	/*
  const mid = req.params.mid;
  db.query('SELECT company_id FROM company_major WHERE major_id = <mid>;', [id], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
  */
});


module.exports = router;
