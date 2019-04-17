// Paths to API implementation files
var companies = require('./companies');
var events = require('./events');
var users = require('./users');
var misc = require('./misc');

module.exports = (app) => {
  app.get('/', function(req, res, next) {
    res.send('The Event Portal server is running!');
  });

  app.get('/test', function(req, res, next) {
    res.send('Hello, World!');
  });

  // Links route prefixes to API routes
  app.use('/companies', companies);
  app.use('/events', events);
  app.use('/users', users);
  app.use('/misc', misc);
}
