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
  knex('company').select()
  .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No companies found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all company names
router.get('/names', function(req, res, next) {
  knex('company').select('name').orderBy('name', 'asc')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No company names found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all company names and logos
router.get('/logos', function(req, res, next) {
  knex('company').select('logo','name').orderBy('name', 'asc')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No company logos found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all company names, logos, and websites
router.get('/websites', function(req, res, next) {
  knex('company').select('logo','name','website').orderBy('name', 'asc')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No company websites found');
      }
    })
    .catch(err => { return next(err) });
});


// GET company info by company_id
router.get('/:company_id/id', function(req, res, next) {
  if(isNaN(req.params.company_id)){
    util.throwError(400, '\'company_id\' is invalid');
  }
  knex('company').select().where({id: req.params.company_id})
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No company info found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all events associated with a given company
router.get('/:company_id/events', function(req, res, next) {
  if(isNaN(req.params.company_id)){
    util.throwError(400, '\'company_id\' is invalid');
  }
  knex('event_company').select('event_id').where({company_id: req.params.company_id})
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No events found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all positions a given company is hiring
router.get('/:company_id/positions', function(req, res, next) {
  if(isNaN(req.params.company_id)){
    util.throwError(400, '\'company_id\' is invalid');
  }
  knex('company_position').select().where({company_id: req.params.company_id})
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No positions found');
      }
    })
    .catch(err => { return next(err) });
    
});

// GET all majors a given company is hiring
router.get('/:company_id/majors', function(req, res, next) {
  if(isNaN(req.params.company_id)){
    util.throwError(400, '\'company_id\' is invalid');
  }
  knex('company_major').select().where({company_id: req.params.company_id})
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No majors found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all contacts for a given company
router.get('/:company_id/contacts', function(req, res, next) {
  if(isNaN(req.params.company_id)){
    util.throwError(400, '\'company_id\' is invalid');
  }
  knex('company_contact').select().where({company_id: req.params.company_id})
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No contacts found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all users interested in a certain company
router.get('/:company_id/users', function(req, res, next) {
  if(isNaN(req.params.company_id)){
    util.throwError(400, '\'company_id\' is invalid');
  }
  knex('user_company_rank').select('user_id').where({company_id: req.params.company_id})
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No users found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all companies containing term substring in their name
router.get('/search', function(req,res,next) {
  knex('company').select().where('name', 'ilike', '%' + req.query.term +'%')
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, 'No companies found');
      }
    })
    .catch(err => { return next(err) });
});

// GET all companies hiring a specific major
router.get('/filter', function(req, res, next) {
  const pid = req.query.pid;
  const mid = req.query.mid;

  if (pid && mid) {
    knex.distinct('company_major.company_id').from('company_major')
    .leftOuterJoin('company_position', 'company_major.company_id', 'company_position.company_id')
    .where({position_id: req.body.pid, major_id: req.query.mid})
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No companies found');
        }
      })
      .catch(err => { return next(err) });
  } else if (mid) {
    knex('company_major').select('company_id').where({major_id: req.body.mid})
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No companies found');
        }
      })
      .catch(err => { return next(err) });
  } else if (pid) {
    knex('company_position').select('company_id').where({position_id: req.body.pid})
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, 'No companies found');
        }
      })
      .catch(err => { return next(err) });
  } else { 
    util.throwError(400, '\'mid\' and \'pid\' are undefined');
  }
});

// Add a single company or related data
router.post('/', function(req, res, next) {
  values = {
    name: req.body.name,
    website: req.body.website,
    logo: req.body.logo,
    citizenship_requirement: req.body.citizenship_requirement,
    description: req.body.description
  }

  var queryCompany = knex('company').insert(values)
  knex.transaction(function(trx) {
    return queryCompany.transacting(trx)
      .returning('id')
      .then(async function(ids){
        let queries = [];
        let i = 0;
        if (req.body.rank && req.body.user_id) {
          rankValues = {
            user_id: req.body.user_id,
            company_id: ids[0],
            rank: req.body.rank
          };
          var queryRank = knex('user_company_rank').insert(rankValues)
          await queryRank.transacting(trx);
        }
        if (req.body.position_id) {
          let length = position_id.length;
          let companyPositions = [];
          for(let n=0; n < length; n++)
          {
            companyPositions.push({
               company_id: ids[0],
               position_id: req.body.position_id[n]
            })
          }
          var queryPos = knex('company_position').insert(companyPositions)
          await queryPos.transacting(trx);
        }
        if (req.body.major_id) {
          let length = major_id.length;
          let companyMajors = [];
          for(let n=0; n < length; n++)
          {
            companyMajors.push({
               company_id: ids[0],
               major_id: req.body.major_id[n]
            })
          }
          var queryMajor = knex('company_major').insert(companyMajors)
          await queryMajor.transacting(trx);
        }
        if (req.body.contact_id) {
          let length = contact_id.length;
          let companyContacts = [];
          for(let n=0; n < length; n++)
          {
            companyContacts.push({
               company_id: ids[0],
               contact_id: req.body.contact_id[n]
            })
          }
          var queryContact = knex('company_contact').insert(companyContacts)
          await queryContact.transacting(trx);
        }   
        if (req.body.event_id) {
          let length = event_id.length;
          let companyEvents = [];
          for(let n=0; n < length; n++)
          {
            companyEvents.push({
               company_id: ids[0],
               event_id: req.body.event_id[n]
            })
          }
          var queryEvent = knex('event_company').insert(companyEvents)
          await queryEvent.transacting(trx);
        }
          return trx.commit;
        })
      })
    .then(function(){
      res.send(util.message('Successfully inserted company'));
    })
    .catch(err => {return next(err) });
  });

//Update a single company
router.put('/:company_id', function(req, res, next) {
  if(req.body.name){
    values = { 
      name: req.body.name,
      website: req.body.website,
      logo: req.body.logo,
      citizenship_requirement: req.body.citizenship_requirement,
      description: req.body.description,
    };

  knex('company').update(values).where({ id: req.params.company_id })
     .then(result => {
        res.send(util.message('Successfully updated company: ' + req.body.name));
      })
      .catch(err => { return next(err) });
  }

  if (req.body.rank && req.body.user_id) {

    rankValues = {
      user_id: req.body.user_id,
      company_id: req.params.company_id,
      rank: req.body.rank
    };

    knex('user_company_rank').insert(rankValues)
      .then(result => {
        res.send(util.message('Successfully inserted new company rank: ' + req.body.rank));
      })  
      .catch(err => { return next(err) });
  }
  //company position
  if (req.body.position_id) {
    companyPositions = {
      company_id: req.params.company_id,
      position_id: req.body.position_id
    };

    knex('company_position').insert(companyPositions)
      .then(result => {
        res.send(util.message('Successfully inserted new company position: ' + req.body.position_id));
      })  
      .catch(err => { return next(err) });
  }
  //company major
  if (req.body.major_id) {
    companyMajors = {
      company_id: req.params.company_id,
      major_id: req.body.major_id
    };

    knex('company_major').insert(companyMajors)
      .then(result => {
        res.send(util.message('Successfully inserted new company major: ' + req.body.major_id));
      })  
      .catch(err => { return next(err) });
  }
  //company contact
  if (req.body.contact_id) {
    companyContacts = {
      company_id: req.params.company_id,
      contact_id: req.body.contact_id
    };

    knex('company_contact').insert(companyContacts)
      .then(result => {
        res.send(util.message('Successfully inserted new company contact: ' + req.body.contact_id));
      })  
      .catch(err => { return next(err) });
  }
  //event company
  if (req.body.event_id) {
    companyEvents = {
      company_id: req.params.company_id,
      event_id: req.body.event_id
    };

    knex('event_company').insert(companyEvents)
      .then(result => {
        res.send(util.message('Successfully inserted new company event: ' + req.body.event_id));
      })  
      .catch(err => { return next(err) });
    }
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