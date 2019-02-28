// Paths to API implementation files
var companies = require('./companies');
var events = require('./events');
var users = require('./users');
var swe = require('./swe');
var db = require('./db');

module.exports = (app) => {
  // Test Endpoint
  app.get('/test', function(req, res, next) {
    res.send('Hello, World!');
  });

  // Links route prefixes to API routes
  app.use('/companies', companies);
  app.use('/events', events);
  app.use('/users', users);
  app.use('/swe', swe);
  app.use('/db', db);
}
