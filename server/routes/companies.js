/* Route Prefix: /companies */
var express = require("express");
var router = express.Router();

var knex = require("../db/knex");
var util = require("../util");

// Returns test string to verify that Companies server is running.
router.get("/ping", function(req, res, next) {
  res.send("pong - Companies API");
});

// GET all companies' info
router.get("/", function(req, res, next) {
  knex("company")
    .select()
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No companies found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all company names
router.get("/names", function(req, res, next) {
  knex("company")
    .select("name")
    .orderBy("name", "asc")
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No company names found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all company names and logos
router.get("/logos", function(req, res, next) {
  knex("company")
    .select("logo", "name")
    .orderBy("name", "asc")
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No company logos found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all company names, logos, and websites
router.get("/websites", function(req, res, next) {
  knex("company")
    .select("logo", "name", "website")
    .orderBy("name", "asc")
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No company websites found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET company info by company_id
router.get("/:company_id/id", function(req, res, next) {
  if (isNaN(req.params.company_id)) {
    util.throwError(400, "Company ID is invalid");
  }
  knex("company")
    .select()
    .where({ id: req.params.company_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No company info found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all events associated with a given company
router.get("/:company_id/events", function(req, res, next) {
  if (isNaN(req.params.company_id)) {
    util.throwError(400, "Company ID is invalid");
  }
  knex("event_company")
    .select("event_id")
    .where({ company_id: req.params.company_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No events found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all positions a given company is hiring
router.get("/:company_id/positions", function(req, res, next) {
  if (isNaN(req.params.company_id)) {
    util.throwError(400, "Company ID is invalid");
  }
  knex("company_position")
    .select()
    .where({ company_id: req.params.company_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No positions found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all majors a given company is hiring
router.get("/:company_id/majors", function(req, res, next) {
  if (isNaN(req.params.company_id)) {
    util.throwError(400, "Company ID is invalid");
  }
  knex("company_major")
    .select()
    .where({ company_id: req.params.company_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No majors found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all contacts for a given company
router.get("/:company_id/contacts", function(req, res, next) {
  if (isNaN(req.params.company_id)) {
    util.throwError(400, "Company ID is invalid");
  }
  knex("company_contact")
    .select()
    .where({ company_id: req.params.company_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No contacts found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all users interested in a certain company
router.get("/:company_id/users", function(req, res, next) {
  if (isNaN(req.params.company_id)) {
    util.throwError(400, "Company ID is invalid");
  }
  knex("user_company_rank")
    .select("user_id")
    .where({ company_id: req.params.company_id })
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No users found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all companies containing term substring in their name
router.get("/search", function(req, res, next) {
  knex("company")
    .select()
    .where("name", "ilike", "%" + req.query.term + "%")
    .then(result => {
      if (result.length) {
        res.json(result);
      } else {
        util.throwError(404, "No companies found");
      }
    })
    .catch(err => {
      return next(err);
    });
});

// GET all companies hiring a specific major
router.get("/filter", function(req, res, next) {
  const pid = req.query.pid;
  const mid = req.query.mid;

  if (pid && mid) {
    knex
      .distinct("company_major.company_id")
      .from("company_major")
      .leftOuterJoin(
        "company_position",
        "company_major.company_id",
        "company_position.company_id"
      )
      .where({ position_id: req.body.pid, major_id: req.query.mid })
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, "No companies found");
        }
      })
      .catch(err => {
        return next(err);
      });
  } else if (mid) {
    knex("company_major")
      .select("company_id")
      .where({ major_id: req.body.mid })
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, "No companies found");
        }
      })
      .catch(err => {
        return next(err);
      });
  } else if (pid) {
    knex("company_position")
      .select("company_id")
      .where({ position_id: req.body.pid })
      .then(result => {
        if (result.length) {
          res.json(result);
        } else {
          util.throwError(404, "No companies found");
        }
      })
      .catch(err => {
        return next(err);
      });
  } else {
    util.throwError(400, "mid and pid are undefined");
  }
});

// Add a single company or related data
router.post("/", function(req, res, next) {
  values = {
    name: req.body.name,
    website: req.body.website,
    logo: req.body.logo,
    citizenship_requirement: req.body.citizenship_requirement,
    description: req.body.description
  };

  let position_ids = req.body.position_id;
  let major_ids = req.body.major_id;
  let contact_ids = req.body.contact_id;
  let event_ids = req.body.event_id;

  let companyPositions = [];
  if (position_ids) {
    if (Array.isArray(position_ids)) {
      position_ids.forEach(function(element) {
        companyPositions.push({ position_id: element });
      });
    } else {
      companyPositions.push({ position_id: position_ids });
    }
  }

  let companyMajors = [];
  if (major_ids) {
    if (Array.isArray(major_ids)) {
      major_ids.forEach(function(element) {
        companyMajors.push({ major_id: element });
      });
    } else {
      companyMajors.push({ major_id: major_ids });
    }
  }

  let companyContacts = [];
  if (contact_ids) {
    if (Array.isArray(contact_ids)) {
      contact_ids.forEach(function(element) {
        companyContacts.push({ contact_id: element });
      });
    } else {
      companyContacts.push({ contact_id: contact_ids });
    }
  }

  let companyEvents = [];
  if (event_ids) {
    if (Array.isArray(event_ids)) {
      event_ids.forEach(function(element) {
        companyEvents.push({ event_id: element });
      });
    } else {
      companyEvents.push({ event_id: event_ids });
    }
  }

  var queryCompany = knex("company").insert(values);
  knex
    .transaction(function(trx) {
      return queryCompany
        .transacting(trx)
        .returning("id")
        .then(async function(ids) {
          let company_id = ids[0];

          if (position_ids) {
            companyPositions.forEach(function(element) {
              element.company_id = company_id;
            });
            var queryPos = knex("company_position").insert(companyPositions);
            await queryPos.transacting(trx);
          }

          if (major_ids) {
            companyMajors.forEach(function(element) {
              element.company_id = company_id;
            });
            var queryMajor = knex("company_major").insert(companyMajors);
            await queryMajor.transacting(trx);
          }

          if (contact_ids) {
            companyContacts.forEach(function(element) {
              element.company_id = company_id;
            });
            var queryContact = knex("company_contact").insert(companyContacts);
            await queryContact.transacting(trx);
          }

          if (event_ids) {
            companyEvents.forEach(function(element) {
              element.company_id = company_id;
            });
            var queryEvent = knex("event_company").insert(companyEvents);
            await queryEvent.transacting(trx);
          }

          return trx.commit;
        });
    })
    .then(function() {
      res.send(util.message("Successfully inserted company"));
    })
    .catch(err => {
      return next(err);
    });
});

// Update a single company
router.put("/:company_id", function(req, res, next) {
  values = {
    name: req.body.name,
    website: req.body.website,
    logo: req.body.logo,
    citizenship_requirement: req.body.citizenship_requirement,
    description: req.body.description
  };
  let position_ids = req.body.position_id;
  let major_ids = req.body.major_id;
  let contact_ids = req.body.contact_id;
  let event_ids = req.body.event_id;

  let remove_position_ids = req.body.remove_position_id;
  let remove_major_ids = req.body.remove_major_id;
  let remove_contact_ids = req.body.remove_contact_id;
  let remove_event_ids = req.body.remove_event_id;
  let company_id = req.params.company_id;

  // insert

  let companyPositions = [];
  if (position_ids) {
    if (Array.isArray(position_ids)) {
      position_ids.forEach(function(element) {
        companyPositions.push({ company_id: company_id, position_id: element });
      });
    } else {
      companyPositions = { company_id: company_id, position_id: position_ids };
    }
    var queryPos = knex.raw(
      "? ON CONFLICT (company_id,position_id) DO NOTHING;",
      [knex("company_position").insert(companyPositions)]
    );
  }

  let companyMajors = [];
  if (major_ids) {
    if (Array.isArray(major_ids)) {
      major_ids.forEach(function(element) {
        companyMajors.push({ company_id: company_id, major_id: element });
      });
    } else {
      companyMajors = { company_id: company_id, major_id: major_ids };
    }
    var queryMajor = knex.raw(
      "? ON CONFLICT (company_id,major_id) DO NOTHING;",
      [knex("company_major").insert(companyMajors)]
    );
  }

  let companyContacts = [];
  if (contact_ids) {
    if (Array.isArray(contact_ids)) {
      contact_ids.forEach(function(element) {
        companyContacts.push({ company_id: company_id, contact_id: element });
      });
    } else {
      companyContacts = { company_id: company_id, contact_id: contact_ids };
    }
    var queryContact = knex("company_contact").insert(companyContacts);
  }

  let companyEvents = [];
  if (event_ids) {
    if (Array.isArray(event_ids)) {
      event_ids.forEach(function(element) {
        companyEvents.push({ company_id: company_id, event_id: element });
      });
    } else {
      companyEvents = { company_id: company_id, event_id: event_ids };
    }
    var queryEvent = knex("event_company").insert(companyEvents);
  }

  // remove
  let removePositions = [];
  if (remove_position_ids) {
    if (Array.isArray(remove_position_ids)) {
      remove_position_ids.forEach(function(element) {
        removePositions.push(element);
      });
    } else {
      removePositions.push(remove_position_ids);
    }
  }
  let removeQueryPos = knex("company_position")
    .whereIn("position_id", removePositions)
    .andWhere("company_id", company_id)
    .del();

  let removeMajors = [];
  if (remove_major_ids) {
    if (Array.isArray(remove_major_ids)) {
      remove_major_ids.forEach(function(element) {
        removeMajors.push(element);
      });
    } else {
      removeMajors.push(remove_major_ids);
    }
  }
  let removeQueryMajor = knex("company_major")
    .whereIn("major_id", removeMajors)
    .andWhere("company_id", company_id)
    .del();

  let removeContacts = [];
  if (remove_contact_ids) {
    if (Array.isArray(remove_contact_ids)) {
      remove_contact_ids.forEach(function(element) {
        removeContacts.push(remove_contact_ids[n]);
      });
    } else {
      removeContacts.push(remove_contact_ids);
    }
  }
  let removeQueryContact = knex("company_contact")
    .whereIn("contact_id", removeContacts)
    .andWhere("company_id", company_id)
    .del();

  let removeEvents = [];
  if (remove_event_ids) {
    if (Array.isArray(remove_event_ids)) {
      remove_event_ids.forEach(function(element) {
        removeEvents.push(remove_event_ids[n]);
      });
    } else {
      removeEvents.push(remove_event_ids);
    }
  }
  let removeQueryEvent = knex("event_company")
    .whereIn("event_id", removeEvents)
    .andWhere("company_id", company_id)
    .del();

  var queryCompany = knex("company")
    .update(values)
    .where({ id: req.params.company_id });
  knex
    .transaction(async function(trx) {
      // modify company attributes
      if (
        req.body.name ||
        req.body.website ||
        req.body.logo ||
        req.body.citizenship_requirement ||
        req.body.description
      ) {
        await queryCompany;
      }

      // insert
      if (position_ids) await queryPos.transacting(trx);

      if (major_ids) await queryMajor.transacting(trx);

      if (event_ids) await queryEvent.transacting(trx);

      if (contact_ids) await queryContact.transacting(trx);

      // remove
      if (remove_position_ids) await removeQueryPos.transacting(trx);

      if (remove_major_ids) await removeQueryMajor.transacting(trx);

      if (remove_contact_ids) await removeQueryContact.transacting(trx);

      if (remove_event_ids) await removeQueryEvent.transacting(trx);

      return trx.commit;
    })
    .then(function() {
      res.send(util.message("Successfully updated company"));
    })
    .catch(err => {
      return next(err);
    });
});

// Delete a single company
router.delete("/:company_id", function(req, res, next) {
  knex("company")
    .del()
    .where({ id: req.params.company_id })
    .then(result => {
      if (result) {
        res.send(
          util.message("Successfully deleted company: " + req.params.company_id)
        );
      } else {
        util.throwError(404, "No company found to delete");
      }
    })
    .catch(err => {
      return next(err);
    });
});

module.exports = router;
