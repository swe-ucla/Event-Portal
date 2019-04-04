/* Route Prefix: /events */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')

// Get all events
router.get('/', function(req, res, next) {
  db.query('SELECT * FROM event', [], (err, result) => {
    if (err) {
        return next(err);
    }
    res.send(result.rows);
  });
});

// GET events listing. 
// router.get('/filter', function(req, res, next) {
//   // const date = req.query.date;


//   db.query('SELECT fb_id FROM event WHERE date(starts_at) <= \'' + date + '\' AND \'' + date + '\' <= date(ends_at)', [], (err, result) => {
//     if (err) {
//         return next(err);
//     }
//     res.send(result.rows);
//   });
// });

module.exports = router;
