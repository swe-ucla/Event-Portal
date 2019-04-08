/* Route Prefix: / */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// Get all majors
router.get('/majors', function(req, res, next) {});

// Get all major names
router.get('/majors/names', function(req, res, next) {});

// Get all UCLA majors
router.get('/uclamajors', function(req, res, next) {});

// Get all positions
router.get('/positions', function(req, res, next) {});

// Get all occupations
router.get('/occupations', function(req, res, next) {});

// Get all diet types
router.get('/diet', function(req, res, next) {});

// Get all contacts
router.get('/contacts', function(req, res, next) {});

// Get all locations
router.get('/locations', function(req, res, next) {});

// Get all location names
router.get('/locations/names', function(req, res, next) {});

// Get all addresses
router.get('/addresses', function(req, res, next) {});

// Get all address names
router.get('/addresses/names', function(req, res, next) {});

// Get all categories
router.get('/categories', function(req, res, next) {});

module.exports = router;
