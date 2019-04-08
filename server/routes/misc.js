/* Route Prefix: / */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// GET all majors
router.get('/majors', function(req, res, next) {
  db.query('SELECT * FROM major', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all major names
router.get('/majors/names', function(req, res, next) {
  db.query('SELECT name FROM major ORDER BY name ASC', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all UCLA majors
router.get('/uclamajors', function(req, res, next) {
  db.query('SELECT * FROM ucla_major', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all positions
router.get('/positions', function(req, res, next) {
  db.query('SELECT * FROM position', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all occupations
router.get('/occupations', function(req, res, next) {
  db.query('SELECT * FROM occupation', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all diet types
router.get('/diet', function(req, res, next) {
  db.query('SELECT * FROM diet', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all contacts
router.get('/contacts', function(req, res, next) {
  db.query('SELECT * FROM contact', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all locations
router.get('/locations', function(req, res, next) {
  db.query('SELECT * FROM location', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all location names
router.get('/locations/names', function(req, res, next) {
  db.query('SELECT name FROM location', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all addresses
router.get('/addresses', function(req, res, next) {
  db.query('SELECT * FROM address', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all address names
router.get('/addresses/names', function(req, res, next) {
  db.query('SELECT name FROM address', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET all categories
router.get('/categories', function(req, res, next) {
  db.query('SELECT * FROM category', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

module.exports = router;
