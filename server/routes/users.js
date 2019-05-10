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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
router.post('/register', function(req, res, next) {
  const diet_id = req.query.diet_id;
  const occupation_id = req.query.occupation_id;
  const position_id = req.query.position_id;
  const company_id = req.query.company_id;
  const major_id = req.query.major_id;
  const rank = req.query.rank;

  knex.transaction(function(trx) { 
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
  return trx
  .insert(values, 'id')
  .into('swe_user')
  .transacting(trx)
  .then(function(ids){

    diet_values = {
      user_id: ids[0],
      diet_id: diet_id
    }
    occupation_values = {
      user_id: ids[0],
      occupation_id: occupation_id
    }
    position_values = {
      user_id: ids[0],
      position_id: position_id
    }
    major_values = {
      user_id:  ids[0],
      major_id: major_id,
    } 
    company_rank_values = {
      user_id:  ids[0],
      company_id: company_id,
      rank: rank
    }

    inserts = []

    if(diet_id){
      inserts.push({
        values: diet_values,
        table_name: 'user_diet'
      });
    }
    if(occupation_id){
      inserts.push({
        values: occupation_values,
        table_name: 'user_occupation'
      });
    }
    if(position_id){
      inserts.push({
        values: position_values,
        table_name: 'user_position'
      });
    }
    if(major_id){
      inserts.push({
        values: major_values,
        table_name: 'user_major'
      });
    }
    if(company_id && rank){
      inserts.push({
        values: company_rank_values,
        table_name: 'user_company_rank'
      });
    }
    console.log(ids[0]); 
    return Promise.map(inserts, function(insert_obj){
        return knex.insert(insert_obj.values).into(insert_obj.table_name).transacting(trx);
      });
    });
  })
  .then(result => {
   res.send(util.message('Successfully inserted new user: ' + req.query.first_name + 'with diet and occupation id'));    
  })
  .catch(err => { return next(err) 
  // If we get here, that means that neither the user insert nor any of the other inserts hav taken place
  })
});


//Login a user
//TO DO: TEST ON POSTMAN
router.put('/login', function(req, res, next) {
  knex('swe_user')
    .update ({
        updated_at: knex.fn.now(),
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
router.get('/:user_id/past', function(req, res, next) {
  const user_id = req.params.user_id;
  knex('event_checkin')
    .select('event_id')
      .innerJoin('event', 'event_checkin.event_id', 'event.fb_id')
        .where('event_checkin.user_id', 3)
          .andWhere('event.ends_at' < now())
            .union([
              knex.select('event_id')
                .from('event_registration')
                  .innerJoin('event', 'event_registration.event_id', 'event.fb_id')
                    .where('event_checkin.user_id', 3)
                      .andWhere('event.ends_at' < now())

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

// GET all companies a user is interested in 
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
  knex('favorite_events').select('event_id')
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
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
//TO DO: TEST ON POSTMAN
router.get('/search', function(req, res, next) {
  const email = req.query.email;
  const name = req.query.name;
  if (email){
    knex('swe_user').select().where('email', 'ilike', '%' + email +'%')
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No users found');
        }
      })
      .catch(err => { return next(err) });
  }
  else if (name){
    knex('swe_user').select().where(knex.raw('CONCAT(first_name, \'\', last_name)'), 'ilike', '%' + name +'%')
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No users found');
        }
      })
      .catch(err => { return next(err) });
  } else { 
    util.throwError(400, '\'email\' and \'name\' are undefined');
  }
});

//GET specific users
//TO DO: TEST ON POSTMAN
router.get('/filter', function(req, res, next) {
  const cid = req.query.cid;
  const oid = req.query.oid;
  const mid = req.query.mid;
  const pid = req.query.pid;
  const admin = req.query.admin;
  // GET all users interested in a given company.
  if (cid){
    knex('user_company_rank').select('user_id').where({company_id: cid})
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No users found');
        }
      })
      .catch(err => { return next(err) });
  }
  // GET all users of the given occupation
  else if (oid){
    knex('user_occupation').select('user_id').where({occupation_id: oid})
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No users found');
        }
      })
      .catch(err => { return next(err) });
  }
  // GET all users of the given major
  else if (mid){
    knex('user_major').select('user_id').where({major_id: mid})
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No users found');
        }
      })
      .catch(err => { return next(err) });
  }
  // GET all users seeking the given position
  else if (pid){
    knex('user_position').select('user_id').where({position_id: pid})
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No users found');
        }
      })
      .catch(err => { return next(err) });
  }
  // GET all admin users
  else if (admin){
    knex('swe_user').select('id').where({is_admin: admin})
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No users found');
        }
      })
      .catch(err => { return next(err) });
  } else { 
    util.throwError(400, 'No parameters are defined');
  }
});

module.exports = router;
