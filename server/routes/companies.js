/* Route Prefix: /companies */
var express = require('express');
var router = express.Router();

const db = require('../db');
var knex = require('../db/knex');
var util = require('../util');

// Returns test string to verify that Companies server is running.
router.get('/ping', function(req, res, next) {
  res.send('pong - Companies API');
});

// GET all companies' info
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM company;', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all company names
router.get('/names', function(req, res, next) {
  db.query('SELECT id, name FROM company ORDER BY name;', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all company names and logos
router.get('/logos', function(req, res, next) {
  db.query('SELECT id, name, logo FROM company ORDER BY name;', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all company names, logos, and websites
router.get('/websites', function(req, res, next) {
  db.query('SELECT id, name, logo, website FROM company ORDER BY name;', [], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET company info by company_id
router.get('/:company_id/id', function(req, res, next) {
  const company_id = req.params.company_id;
  db.query('SELECT * FROM company WHERE id = $1;', [company_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all events associated with a given company
router.get('/:company_id/events', function(req, res, next) {
  const company_id = req.params.company_id;
  db.query('SELECT event_id FROM event_company WHERE company_id = $1;', [company_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all positions a given company is hiring
router.get('/:company_id/positions', function(req, res, next) {
  const company_id = req.params.company_id;
  db.query('SELECT * FROM company_position WHERE company_id = $1;', [company_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all majors a given company is hiring
router.get('/:company_id/majors', function(req, res, next) {
  const company_id = req.params.company_id;
  db.query('SELECT * FROM company_major WHERE company_id = $1;', [company_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all contacts for a given company
router.get('/:company_id/contacts', function(req, res, next) {
  const company_id = req.params.company_id;
  db.query('SELECT * FROM company_contact WHERE company_id = $1;', [company_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all users interested in a certain company
router.get('/:company_id/users', function(req, res, next) {
  const company_id = req.params.company_id;
  db.query('SELECT user_id FROM user_company_rank WHERE company_id = $1;', [company_id], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all companies containing term substring in their name
router.get('/search', function(req,res,next) {
  const search = req.query.term;
  if (search == undefined) {
    return res.status(400).send({
      message: '\'term\' is undefined'
    });
  }

  db.query('SELECT id FROM company WHERE name ~~* $1', ['%' + search +'%'], (err, result) => {
    if (err) return next(err);
    res.send(result.rows);
  });
});

// GET all companies hiring a specific major
router.get('/filter', function(req, res, next) {
  const pid = req.query.pid;
  const mid = req.query.mid;

  if (pid && mid) {
    db.query('SELECT DISTINCT company_major.company_id FROM company_major LEFT OUTER JOIN company_position ON (company_major.company_id = company_position.company_id) WHERE (position_id = $1 AND major_id = $2);', [pid, mid], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (mid) {
    db.query('SELECT company_id FROM company_major WHERE major_id = $1;', [mid], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else if (pid) {
    db.query('SELECT company_id FROM company_position WHERE position_id = $1;', [pid], (err, result) => {
      if (err) return next(err);
      res.send(result.rows);
    });
  } else { 
    return res.status(400).send({
      message: '\'mid\' and \'pid\' are undefined'
    });
  }
});

// Add a single company
router.post('/', function(req, res, next) {
  if (!req.query.name) {
    util.throwError(400, 'Company name must not be null');
  }

  values = {
    name: req.query.name,
    website: req.query.website,
    logo: req.query.logo,
    citizenship_requirement: req.query.citizenship_requirement,
    description: req.query.description
  };
  
  knex('company').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new company: ' + req.query.name));
    })
    .catch(err => { return next(err) });
});

// Delete a single company
router.delete('/:company_id', function(req,res,next){
  knex('company').del().where({id: req.params.company_id})
    .then(result => {
      if (result) {
        res.send(util.message('Successfully deleted company: ' + req.params.company_id));
      } else {
        util.throwError(404, 'No company found to delete');
      }
    })
    .catch(err => { return next(err) });
});

module.exports = router;