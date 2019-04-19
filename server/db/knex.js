// Configure Knex.js options depending on whether we are running on test
// database locally or production database in AWS.
// https://knexjs.org
var options;
if (process.env.NODE_ENV === 'development') {
  // Runs Postgres in a Docker Container
  console.log('Using Postgres image in Docker Container.')
  options = {
    client: 'pg',
    connection: process.env.POSTGRES_URL,
    // Uncomment debug to log query information to console
    // debug: 'knex:query', 
  };
} else {
  // Uses Environment Variables for connection information for Amazon RDS
  console.log('Using Amazon RDS for Postgres.')
  options = {
    client: 'pg',
    connection: {
      host:     process.env.PGHOST,
      port:     process.env.PGPORT,
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD,
      database: process.env.PGDATABASE
    }
  };
}

const knex = require('knex')(options);

// https://knexjs.org/#Interfaces-Events
module.exports = knex
  .on('query-error', (err, data) => {
    console.log('ERROR: Failed query:', { text: data.sql });
  })
  .on('query-response', (err, data) => {
    console.log('Executed query:', { text: data.sql, rows: data.response.rowCount });
  });
