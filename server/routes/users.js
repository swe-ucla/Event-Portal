/* Route Prefix: /users */
var express = require('express');
var router = express.Router();

// Require database file (not node-postgres directly)
var knex = require('../db/knex');
var util = require('../util');

// GET test string to verify that Users server is running.
router.get('/ping', function(req, res, next) {
  res.send('pong - Users API');
});

// GET all users.
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

// GET all user names.
router.get('/names', function(req, res, next) {
  knex('swe_user').select(knex.raw('CONCAT(first_name, \' \', last_name)'))
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No user names found');
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
        util.throwError(404, 'No user emails found');
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
        util.throwError(404, 'No user university IDs found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a user
router.post('/register', function(req, res, next) {
  //TODO: fix inconsistency b/w id and ID*S*
  let diet_ids = req.body.diet_id;
  let occupation_ids = req.body.occupation_id;
  let position_ids = req.body.position_id;
  let company_ids = req.body.company_id;
  let major_ids = req.body.major_id;
  let ranks = req.body.rank;
  let swe_id = req.body.swe_id;
  let gpa = req.body.gpa;

  values = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    university_id: req.body.university_id,
    is_admin: req.body.is_admin,
    swe_id: req.body.swe_id,
    gpa: req.body.gpa,
  }

  if (company_ids && ranks) {
    if (Array.isArray(company_ids) && Array.isArray(ranks)) {
      company_ids.forEach(function(element, i) { 
        company_rank_values.push({ company_id : element, rank: ranks[i] })
      });
    } else {
      company_rank_values.push({ company_id : company_ids, rank : ranks })
    }
  }
  

  var query_user = knex('swe_user').insert(values)
  knex.transaction(function(trx) { 
    return query_user.transacting(trx)
      .returning('id')
      .then(async function(ids) {
        let user_id = ids[0];
        
        if (diet_ids) {
          diet_ids.forEach(function(element) { element.user_id = user_id; })
          var query_diet = knex('user_diet').insert(diet_ids)
          await query_diet.transacting(trx);
        }
        if (occupation_ids) {
          occupation_ids.forEach(function(element) { element.user_id = user_id; })
          console.log(occupation_ids)
          var query_occupation = knex('user_occupation').insert(occupation_ids)
        }
        if (position_ids) {
          position_ids.forEach(function(element) { element.user_id = user_id; })
          var query_position = knex('user_position').insert(position_ids)
          await query_position.transacting(trx);
        }

        if (major_ids) {
          major_ids.forEach(function(element) { element.user_id = user_id; })
          var query_major = knex('user_major').insert(major_ids)
          await query_major.transacting(trx);
        }
        if (company_ids && ranks) {
          company_rank_values.forEach(function(element) { element.user_id = user_id; })
          var query_company = knex('user_company_rank').insert(company_rank_values)
          console.log(company_rank_values)
          await query_company.transacting(trx);
        }
        return trx.commit;
      })
  })
  .then(function() {
    //console.log(major_values)
    console.log(major_ids)
    console.log(occupation_values)
    res.send(util.message('Successfully inserted user'));
  })
  .catch(err => {return next(err) });
});


// Login a user
router.put('/login', function(req, res, next) {
  var app = express()

  // Test enviroment session setup
  var sess = {
    secret: 'keyboard cat',
    cookie: {}
  }

  // Production environment session setup
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
  }

  app.use(session(sess))

  knex('swe_user').where({ email: req.body.email, password: req.body.password })
    .then(result => {
      res.send(util.message('Successfully logged in user with email: ' + req.body.email));
    })
    .catch(err => { return next(err) });
});

// GET user info by user_id
router.get('/:user_id/id', function(req, res, next) {
  if (isNaN(req.params.user_id)) {
    util.throwError(400, 'User ID is invalid');
  }
  knex('swe_user').select().where({ id: req.params.user_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// GET whether user is admin or not
router.get('/:user_id/admin', function(req, res, next) {
  if (isNaN(req.params.user_id)) {
    util.throwError(400, 'User ID is invalid');
  }
  knex('swe_user').select('is_admin').where({ id: req.params.user_id })
    .then(result => {
      if (result.length) {
          res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// Update user info
router.put('/:user_id', function(req, res, next) {
  if (isNaN(req.params.user_id)) {
    util.throwError(400, 'User ID is invalid');
  }
  values = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
    university_id: req.body.university_id,
    is_admin: req.body.is_admin,
    swe_id: req.body.swe_id,
    gpa: req.body.gpa
  }

  let user_id = req.params.user_id;
  let diet_ids = req.body.diet_ids;
  let occupation_ids = req.body.occupation_ids;
  let position_ids = req.body.position_ids;
  let major_ids = req.body.major_ids;
  let company_ids = req.body.company_ids;
  let ranks = req.body.ranks;

  let remove_diet_ids = [];
  let remove_occupation_ids = [];
  let remove_position_ids = [];
  let remove_major_ids = [];
  let remove_company_ids = [];

  if (diet_ids) {
    diet_ids.forEach(function(element) { 
      element.user_id = user_id;
      remove_diet_ids.push([ user_id, element.diet_id ]); 
    })
    if (diet_ids.length > 0) {
      var query_diet = knex.raw(
        '? ON CONFLICT (user_id,diet_id) DO NOTHING;', [knex('user_diet').insert(diet_ids)],
      );
    }
    var query_remove_diet = knex('user_diet').del().where('user_id', user_id).whereNotIn(['user_id', 'diet_id'], remove_diet_ids);
  }

  if (major_ids) {
    major_ids.forEach(function(element) { 
      element.user_id = user_id;
      remove_major_ids.push([ user_id, element.major_id ]); 
    })
    if (major_ids.length > 0) {
      var query_major = knex.raw(
        '? ON CONFLICT (user_id,major_id) DO NOTHING;', [knex('user_major').insert(major_ids)],
      );
    }
    var query_remove_major = knex('user_major').del().where('user_id', user_id).whereNotIn(['user_id', 'major_id'], remove_major_ids);
  }
  
  if (occupation_ids) {
    occupation_ids.forEach(function(element) { 
      element.user_id = user_id;
      remove_occupation_ids.push([ user_id, element.occupation_id ]); 
    })
    if (occupation_ids.length > 0) {
      var query_occupation = knex.raw(
          '? ON CONFLICT (user_id,occupation_id) DO NOTHING;', [knex('user_occupation').insert(occupation_ids)],
      );
    }
    var query_remove_occupation = knex('user_occupation').del().where('user_id', user_id).whereNotIn(['user_id', 'occupation_id'], remove_occupation_ids);
  }
  
  if (position_ids) {
    position_ids.forEach(function(element) { 
      element.user_id = user_id;
      remove_position_ids.push([ user_id, element.position_id ]); 
    })
    if (position_ids.length > 0) {
      var query_position = knex.raw(
          '? ON CONFLICT (user_id,position_id) DO NOTHING;', [knex('user_position').insert(position_ids)],
      );
    }
    var query_remove_position = knex('user_position').del().where('user_id', user_id).whereNotIn(['user_id', 'position_id'], remove_position_ids);
  }

  if (major_ids) {
     major_ids.forEach(function(element) { 
      element.user_id = user_id;
      remove_major_ids.push([ user_id, element.major_id ]); 
    })
    if (major_ids.length > 0) {
      var query_major = knex.raw(
        '? ON CONFLICT (user_id,major_id) DO NOTHING;', [knex('user_major').insert(major_ids)],
      );
    }
    var query_remove_major = knex('user_major').del().where('user_id', user_id).whereNotIn(['user_id', 'major_id'], remove_major_ids);
  } 

  if (company_ids && ranks) {
      company_ids.forEach(function(element, i) {
        element.rank = ranks[i];
        element.user_id = user_id;
        remove_company_ids.push([ user_id, element, ranks[i] ])
      });
    if (company_ids.length > 0) {
      var query_company = knex.raw(
          '? ON CONFLICT (user_id,company_id,rank) DO NOTHING;', [knex('user_company_rank').insert(company_ids)],
      );
    }
    var query_remove_company = knex('user_company_rank').del().where('user_id', user_id).whereNotIn(['user_id', 'company_id', 'rank'], remove_company_ids);
  }

  
  var query_user = knex('swe_user').update(values).where({ id : user_id})
  knex.transaction(async function(trx) { 
    if ((req.body.first_name && req.body.last_name) || 
         req.body.password || 
         req.body.email || 
         req.body.phone || 
         req.body.university_id || 
         req.body.is_admin ||
         req.body.swe_id || 
         req.body.gpa) {
      await query_user;
    }

    if (query_diet) await query_diet.transacting(trx);
    if (query_occupation) await query_occupation.transacting(trx);
    if (query_position) await query_position.transacting(trx);
    if (query_major) await query_major.transacting(trx);
    if (query_company) await query_company.transacting(trx);    
    if (query_remove_diet) await query_remove_diet.transacting(trx);
    if (query_remove_occupation) await query_remove_occupation.transacting(trx);
    if (query_remove_position) await query_remove_position.transacting(trx);
    if (query_remove_major) await query_remove_major.transacting(trx);    
    if (query_remove_company) await query_remove_company.transacting(trx);
    return trx.commit;
  })
  .then(result => {
    res.send(util.message('Successfully updated user.'));    
  })
  .catch(err => { return next(err) })
});

// GET a user's past events
router.get('/:user_id/past', function(req, res, next) {
  if (isNaN(req.params.user_id)) {
    util.throwError(400, 'User ID is invalid');
  }
  knex('event_checkin')
    .select('event_id')
    .innerJoin('event', 'event_checkin.event_id', 'event.fb_id')
    .where('event_checkin.user_id', req.params.user_id)
    .andWhere('event.ends_at' < Date.now())    
    .union([
      knex('event_registration')
        .select('event_id')
        .innerJoin('event', 'event_registration.event_id', 'event.fb_id')
        .where('event_registration.user_id', req.params.user_id)
    ])
    
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all companies a user is interested in 
router.get('/:user_id/companies', function(req, res, next) {
  if (isNaN(req.params.user_id)) {
    util.throwError(400, 'User ID is invalid');
  }
  knex('user_company_rank')
    .select('company_id', 'rank')
    .where({ user_id: req.params.user_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all events a user is attending
router.get('/:user_id/events', function(req, res, next) {
  if (isNaN(req.params.user_id)) {
    util.throwError(400, 'User ID is invalid');
  }
  const user_id = req.params.user_id;
  knex('event_checkin')
    .select('event_id')
    .where({user_id: user_id})
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
    .catch(err => { return next(err) });
});

// GET all events a user is hosting
router.get('/:user_id/host', function(req, res, next) {
  knex('event_host').select('event_id').where({ host_id: req.params.user_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all the user's majors
router.get('/:user_id/majors', function(req, res, next) {
  knex('user_major').select('major_id').where({ user_id: req.params.user_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all positions a user is seeking
router.get('/:user_id/positions', function(req, res, next) {
  knex('user_position').select('position_id').where({ user_id: req.params.user_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all the user's occupations
router.get('/:user_id/occupations', function(req, res, next) {
  knex('user_occupation').select('occupation_id').where({ user_id: req.params.user_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// GET the user's diet information
router.get('/:user_id/diet', function(req, res, next) {
  knex('user_diet').select('diet_id ').where({ user_id: req.params.user_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// GET a user's favorite events
router.get('/:user_id/favorite', function(req, res, next) {
  knex('favorite_events').select('event_id').where({ user_id: req.params.user_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users matching user_id = ' + req.params.user_id + ' found');
      }
    })
    .catch(err => { return next(err) });
});

// Add a favorite event to a user
router.post('/:user_id/favorite/:event_id', function(req, res, next) {
  if (!req.params.event_id) {
    util.throwError(400, 'Event ID must not be null');
  }
  if (!req.params.user_id) {
    util.throwError(400, 'User ID must not be null');
  }

  values = { event_id: req.params.event_id, user_id: req.params.user_id }
  knex('favorite_events').insert(values)
    .then(result => {
      res.send(util.message('Successfully inserted new favorite event: ' + req.params.event_id + ' for user ' + req.params.user_id));
    })
    .catch(err => { return next(err) });
});

// Delete a favorite event from a user
router.delete('/:user_id/favorite/:event_id', function(req, res, next) {
  values = { event_id: req.params.event_id, user_id: req.params.user_id }
  knex('favorite_events').del().where(values)
    .then(result => {
      res.send(util.message('Successfully deleted favorite event: ' + req.params.event_id + ' for user ' + req.params.user_id));
    })
    .catch(err => { return next(err) });
});

// TODO: Fix Search Logic
router.get('/search', function(req, res, next) {
  const email = req.query.email;
  const name = req.query.name;
  if (email) {
    knex('swe_user').select().where('email', 'ilike', '%' + email +'%')
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No users found');
        }
      })
      .catch(err => { return next(err) });
  } else if (name) {
    knex('swe_user').select().where(knex.raw('CONCAT(first_name, \' \', last_name)'), 'ilike', '%' + name +'%')
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

// TODO: Fix Filter Logic
// GET specific users
router.get('/filter', function(req, res, next) {
  const cid = req.query.cid;
  const oid = req.query.oid;
  const mid = req.query.mid;
  const pid = req.query.pid;
  const admin = req.query.admin;
  // GET all users interested in a given company.
  if (cid) {
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
  else if (oid) {
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
  else if (mid) {
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
  else if (pid) {
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
  else if (admin) {
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
