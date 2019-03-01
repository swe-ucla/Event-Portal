// Paths to API implementation files
var companies = require('./companies');
var events = require('./events');
var users = require('./users');
var swe = require('./swe');
var db = require('./db');

module.exports = (app) => {
  /**
  * @swagger
  *
  * /test:
  *   get:
  *     summary: Returns test string to verify that server is running.
  *     tags:
  *       - TEST
  *     responses:
  *       200:
  *         description: OK
  *         content:
  *           text/plain:
  *             schema:
  *               type: string
  *               example: Hello, World!
  *       404:
  *         $ref: '#/components/responses/NotFound' 
  */
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
