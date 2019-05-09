/* Route Prefix: /users */
var express = require('express');
var router = express.Router();

// Require database adapter file (not node-postgres directly)
const db = require('../db')
var knex = require('../db/knex');
var util = require('../util');
var Promise = require('bluebird');

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
let id = []
//var Promise = require('bluebird');

router.post('/register', function(req, res, next) {
 knex.transaction(function(trx) { 
  values =
  {
    //id: req.query.id,
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    password: req.query.password,
    email: req.query.email,
    phone: req.query.phone,
    university_id: req.query.university_id,
    is_admin: req.query.is_admin,
  }
  return trx
  .insert(values, 'id')
  .into('swe_user')
  .transacting(trx)
  .then(function(ids){
    dietValues = {
      user_id: ids[0],
      diet_id: req.query.diet_id
    }
    occupationValues = {
      user_id: 99,//ids[0],
      occupation_id: req.query.occupation_id
    }
    //[dietValues, 'user_diet'],
    console.log(ids[0]); 
    let pizzas = [[dietValues, 'user_diet'], [occupationValues, 'user_occupation']]
    //let strings = ['users_diet','user_position']
    return Promise.map(pizzas, function(pizza){
        console.log("hello" + ids[0].toString() + pizza[0].toString() + pizza[1].toString() + dietValues.toString() + occupationValues.toString());
        return knex.insert(pizza[0]).into(pizza[1]).transacting(trx);
    });
  });
  //.then(trx.commit)
  //.catch(trx.rollback);
})
.then(result => {
   res.send(util.message('Successfully inserted new user: ' + req.query.first_name + 'with diet and occupation id'));    
})
.catch(err => { return next(err) 
  // If we get here, that means that neither the user insert
  //nor the diet insert has taken place.
})

  /*
  if (!req.query.first_name) {
    util.throwError(400, 'First name must not be null');
  }
  if (!req.query.last_name) {
    util.throwError(400, 'First name must not be null');
  }
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
  }
  id = knex('swe_user')
  .returning('id')
  .insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new user: ' + req.query.first_name));
    })
    .catch(err => { return next(err) });
  */
});

  /*
  var user_id = knex('swe_user')
    .('id')
    .insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new user: ' + req.query.first_name));
    })
    .catch(err => { return next(err) });
*/
/*
  values = {
    user_id: id[0],
    diet_id: req.query.diet_id 
  }
  
  knex('user_diet').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted diet for user: ' + req.query.id));
    })
    .catch(err => { return next(err) });
  /*

  values = {
    user_id: user_id, //req.query.id,
    occupation_id: req.query.occupation_id
  }
  */
  /*
  knex('user_occupation').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted occupation for user: ' + req.query.id));
    })
    .catch(err => { return next(err) });

  values = {
    user_id: req.query.id,
    position_id: req.query.position_id
  }

  knex('user_position').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted position for user: ' + req.query.id));
    })
    .catch(err => { return next(err) });
  
  values = {
    user_id:  req.query.id,
    major_id: req.query.major_id,
  } 

  knex('user_major').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted major for user: ' + req.query.id));
    })
    .catch(err => { return next(err) });
  
  values = {
    user_id:  req.query.id,
    company_id: req.query.company_id,
    rank: req.query.rank

  }
  
  knex('user_company_rank').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted company rank for user: ' + req.query.id));
    })
    .catch(err => { return next(err) }
    */
  

//Login a user
//Unsuccessful on postman
//TODO: add updated at to the database
router.put('/login', function(req, res, next) {
  knex('swe_user')
    .update ({
        update_at: knex.fn.now(),
    })
    .where({ 
        email: req.query.email, 
        password: req.query.password,
    })
    .then(result => {
      res.send(util.message('Successfully logged in user with email: ' + req.query.email));
    })
    .catch(err => { return next(err) });
});



// GET user info by user_id
//P
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
//P
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
router.put('/:user_id', function(req, res, next) {
  values =
  {
    first_name: req.query.first_name,
    last_name: req.query.last_name,
    password: req.query.password,
    email: req.query.email,
    phone: req.query.phone,
    university_id: req.query.university_id,
    is_admin: req.query.is_admin,
  }
  knex('swe_user').update(values).where({ id: req.params.user_id })
    .then(result => {
      res.send(util.message('Successfully updated user: ' + req.query.first_name));
    })
    .catch(err => { return next(err) });
});


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
//P
router.get('/:user_id/events', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('event_checkin').select('event_id').where({user_id: user_id})
  .union([
    knex('event_registration').select('event_id').where({user_id: user_id})
  ])
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

// GET all events a user is hosting
//P
router.get('/:user_id/host', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('event_host').select('event_id')
  .where( {host_id: user_id} )
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

// GET all the user's majors
//P
router.get('/:user_id/majors', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('user_major').select('major_id')
  .where( {user_id: user_id} )
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

// GET all positions a user is seeking
//TODO: Test on Postman
router.get('/:user_id/positions', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('user_position').select('position_id')
  .where( {user_id: user_id} )
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

// GET all the user's occupations
//TODO: Test on postman
router.get('/:user_id/occupations', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('user_occupation').select('occupation_id')
  .where( {user_id: user_id} )
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

// GET the user's diet information
//TODO: Test on Postman
router.get('/:user_id/diet', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('user_diet').select('diet_id ')
  .where( {user_id: user_id} )
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

// GET a user's favorite events
//TODO: Test on Postman
router.get('/:user_id/favorite', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('favorite_events').select('event_id ')
  .where( {user_id: user_id} )
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

//Add a favorite event to a user
router.post('/:user_id/favorite/:event_id', function(req, res, next) {
  if (!req.params.event_id) {
    util.throwError(400, 'Event ID must not be null');
  }
  if (!req.params.user_id) {
    util.throwError(400, 'User ID must not be null');
  }
  values =
  {
    event_id: req.params.event_id,
    user_id: req.params.user_id,
  }
  knex('favorite_events').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new favorite event: ' + req.params.event_id + ' for user ' + req.params.user_id));
    })
    .catch(err => { return next(err) });
});

//Delete a favorite event from a user
router.delete('/:user_id/favorite/:event_id', function(req, res, next) {
  values =
  {
    event_id: req.params.event_id,
    user_id: req.params.user_id,
  }
  knex('favorite_events').del().where(values)
    .then(result => {
      res.send(util.message('Successfully deleted favorite event: ' + req.params.event_id + ' for user ' + req.params.user_id));
    })
    .catch(err => { return next(err) });
});

//TODO: Fix Search Logic
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
