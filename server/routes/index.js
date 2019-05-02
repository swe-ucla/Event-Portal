// Paths to API implementation files
var addresses = require('./addresses');
var categories = require('./categories');
var companies = require('./companies');
var contacts = require('./contacts');
var diet = require('./diet');
var events = require('./events');
var locations = require('./locations');
var majors = require('./majors');
var occupations = require('./occupations');
var positions = require('./positions');
var uclamajors = require('./uclamajors');
var users = require('./users');

module.exports = (app) => {
  app.get('/test', function(req, res, next) {
    res.send('Hello, World!');
  });

  // Links route prefixes to API routes
  app.use('/addresses', addresses);
  app.use('/categories', categories);
  app.use('/companies', companies);
  app.use('/contacts', contacts);
  app.use('/diet', diet);
  app.use('/events', events);
  app.use('/locations', locations);
  app.use('/majors', majors);
  app.use('/occupations', occupations);
  app.use('/positions', positions);
  app.use('/uclamajors', uclamajors);
  app.use('/users', users);
}
