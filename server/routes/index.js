var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Hello, World!');
});

/* Check that server is running. */
router.get('/ping', function(req, res, next) {
  res.send('pong');
});

router.get('/api', function(req, res) {
  const data = {
    message: 'Hello, API!'
  };
  res.json(data);
});

router.get('/random', function(req, res, next) {
    let my_JSON = {};
    my_JSON.number = Math.random();
    res.json(my_JSON);
});

router.post('/name', function(req, res) {
    var name = req.query.name;
    if (name == undefined) {
        res.status(400);
        const error_msg = {
            message: "Input JSON does not contain key 'name'"
        };
        res.json(error_msg);
    } else {
        const name_msg = 'Hello ' + name;
        const name_JSON = {
            message: name_msg
        };
        res.json(name_JSON);
    }
});

router.get('/name/:name', function(req, res) {
    const name = req.params.name;
    if (name == undefined) {
        res.status(400);
        const error_msg = {
            message: "Missing required field for 'name'"
        };
        res.json(error_msg);
    } else {
        const name_msg = 'Hello ' + name;
        const name_JSON = {
            message: name_msg
        };
        res.json(name_JSON);
    }
});

router.post('/name/:firstname', function(req, res) {
    const firstname = req.params.firstname;
    const lastname = req.query.lastname;
    if (firstname == undefined || lastname == undefined) {
        res.status(400);
        const error_msg = {
            message: "Missing required fields for 'firstname' and/or 'lastname'"
        };
        res.json(error_msg);
    } else {
        const name_msg = 'Hello ' + firstname + ' ' + lastname;
        const name_JSON = {
            message: name_msg
        };
        res.json(name_JSON);
    }
});

module.exports = router;
