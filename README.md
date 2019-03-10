# Event-Portal



## Overview

UCLA SWE's event portal. Coming Soon!



## Built With

- [Docker](https://www.docker.com/): Tool to deploy applications in containers
- [React](https://reactjs.org/): JS library for building UIs
- [Node.js](https://nodejs.org/en/): JS run-time environment
- [Express](https://expressjs.com/): Web application framework for Node.js
- [Postgres](https://www.postgresql.org/)/[Docker Postgres](https://docs.docker.com/samples/library/postgres/)/[Amazon RDS for PostgreSQL](https://aws.amazon.com/rds/postgresql/): Open source relational database
- [Swagger](https://swagger.io/)/[swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc): Generates API documentation from code comments
- [AWS EB](https://aws.amazon.com/elasticbeanstalk/): Service for deploying and scaling web applications



## Global Dependencies

 - **NOTE**: In order to run app, developers need the `.env` file 
     - Should be kept in the same directory as the `Makefile`/this `README`/etc.
 - General Dev Dependencies
    - Homebrew [install](https://brew.sh/)
    - Xcode Developer Tools (Mac)
       - `xcode-select --install`
    - Yarn [install](https://yarnpkg.com/en/docs/install)
 - Stack Dependencies
    - Docker [install](https://docs.docker.com/engine/installation/) and run daemon
      - Should include [Docker-Compose](https://docs.docker.com/compose/install/) in install
    - Node [install](https://nodejs.org/en/)
      - Create React App [docs](https://github.com/facebookincubator/create-react-app)
    - Postgres [install](https://postgresapp.com/downloads.html)



## Architecture

- More specific READMEs are located in `client/` and `server/`.

- Client: React

  - The client service contains the React app
  - Makes API calls to the Express server through proxy in `client/package.json`

- Server: ExpressJS

  - The server service runs the Express app 
  - Serves the Companies, Events, and Users APIs
  - Serves the static files from the production build of the React Client in`client/`

- Database: Postgres

  - Docker Postgres used for local development
  - Amazon RDS for PostgreSQL used for production
  - Main configuration with connection information in `server/db/index.js` 
  - Diagrams for the database schema as of `3/7/19` is found in `./database/pg_db_diagram.pdf`
  - **NOTE**: for test data, unzip `./database/pgdata.zip` and move the resulting `pgdata/` folder to `./database/postgres/pgdata/`
    - Run sql files as necessary to populate running Postgres container with sample data

```bash
$ make pg

# Drops tables, creates tables, creates triggers, and populates from CSVs
swetest=# \i /var/lib/postgresql/data/pgdata/load.sql;

# Empties tables, populates from CSVs
swetest=# \i /var/lib/postgresql/data/pgdata/load.sql;
```



## Stack Commands

##### Run Stack in Development Mode

```bash
$ make dev
```

  - Both `client/` and `server/` are separate Docker Containers linked with `docker-compose-dev.yml`
    - The React Client is available at [http://localhost:3000](http://localhost:3000)
    - The Express Server is available at [http://localhost:5000](http://localhost:5000)
  - The `database/` container has locally mounted data for development at port `5432`

    - Can access `psql` shell for running Postgres container

    - ```bash
      $ make pg
      ```

  - Local directories are mounted into the containers
    - Changes will reflect upon save/refresh
      - Exceptions: changes to package.json, new css files, etc.

##### Run Stack in Production Mode

```bash
$ make prod
```

- Creates static build of the React Client app in `client/build/`

- Runs Express Server which handles serving both the API and the static client files

- Uses environment variables from `docker-compose.yml` to connect with Amazon Postgres database

  - Can access `psql` shell for Amazon RDS for PostgreSQL database

  - ```bash
    $ make db
    ```
##### Stop the Stack

- Works for both production and development modes

- In same terminal tab that we ran stack, Ctrl+C or: 

```bash
$ make stop
```




## Deploy to AWS EB
- Commit all relevant changes in `swe-ucla/Event-Portal` repository
- Bundle application source code
  - Only includes files stored in git, excluding ignored files and git files
  - Specify version number by setting environment variable with call
    - Version defaults to 666, should be manually fixed

```bash
$ make zip VERSION=4.2
```

- [Login](https://swe-dev.signin.aws.amazon.com) to AWS Developer Console
  - Navigate to the Elastic Beanstalk Service in region `us-east-1`, aka N. Virginia
  - Select the environment `EventPortalEnv` in application `swe-event-portal`
- Select `Upload and Deploy` in the EB dashboard
  - Upload zip from earlier step
  - Should autogenerate label of the format: `event_portal_v#.#`
- Deploy! 
  - Changes should appear after environment update has completed successfully
