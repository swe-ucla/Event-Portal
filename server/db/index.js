const { Pool } = require('pg')

// Uses Environment Variables for connection information
// const pool = new Pool()

var pool;
if (process.env.NODE_ENV === 'development') {
  // Runs Postgres in a Docker Container
  console.log('Using Postgres image in Docker Container.')
  pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })
} else {
  // Uses Environment Variables for connection information for Amazon RDS
  console.log('Using Amazon RDS for Postgres.')
  pool = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE
  })
}

// https://node-postgres.com/guides/project-structure
module.exports = {
  query: (text, params, callback) => {
    const start = Date.now()
    return pool.query(text, params, (err, res) => {
      const duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  },
  // https://node-postgres.com/features/pooling
  getClient: (callback) => {
    pool.connect((err, client, done) => {
      const query = client.query.bind(client)

      // Monkey patch the query method to keep track of the last query executed
      client.query = () => {
        client.lastQuery = arguments
        client.query.apply(client, arguments)
      }

      // Set a timeout of 5 seconds, after which we will log this client's last query
      const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
      }, 5000)

      const release = (err) => {
        // Call the actual 'done' method, returning this client to the pool
        done(err)

        // Clear our timeout
        clearTimeout(timeout)

        // Set the query method back to its old un-monkey-patched version
        client.query = query
      }

      callback(err, client, done)
    })
  }
}
