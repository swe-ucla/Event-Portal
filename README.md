# Event-Portal



## Overview

UCLA SWE's event portal. Coming Soon!



## Documentation

Hosted on GitHub Pages at TODO: [Swagger](https://swagger.io/docs/)? http://apidocjs.com/example/?



## Built With

- [Docker](https://www.docker.com/): Tool to deploy applications in containers
- [React](https://reactjs.org/): JS library for building UIs
- [Node.js](https://nodejs.org/en/): JS run-time environment
- [Express](https://expressjs.com/): Web application framework for Node.js
- [Postgres](https://www.postgresql.org/): Open source relational database
- [Nginx](https://www.nginx.com/): Web server and reverse proxy
- [AWS](https://aws.amazon.com/) [EC2](https://aws.amazon.com/ec2/)/[Elastic Container Service](https://aws.amazon.com/ecs/): Deploys Docker containers



## Global Dependencies

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



## Stack Commands

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

##### Run Stack in Development Mode

```bash
$ make dev
```

  - Both `client/` and `server/` are separate Docker Containers linked with `docker-compose-dev.yml`
    - The React Client is available at [http://localhost:3000](http://localhost:3000)
    - The Express Server is available at [http://localhost:5000](http://localhost:5000)
  - The `database/` container has locally mounted data for development at port `5432`

    - Can access `psql` shell by finding the container ID for the database container from `docker ps` and using it to interact with container

    - ```bash
      # Use <container-id> from `docker ps` output
      $ docker ps
      $ docker exec -ti <container-id> psql -U postgres
      ```

  - Local directories are mounted into the containers
    - Changes will reflect upon save/refresh
      - Exceptions: changes to package.json, new css files, etc.

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
  - Call command from the repo root, at the level of this `README`

```bash
$ git archive -v -o event_portal_v4.2.zip --format=zip HEAD
```

- [Login](https://swe-dev.signin.aws.amazon.com) to AWS Developer Console
  - Navigate to the Elastic Beanstalk Service in region `us-east-1`, aka N. Virginia
  - Select the environment `EventPortalEnv` in application `swe-event-portal`
- Select `Upload and Deploy` in the EB dashboard
  - Upload zip from earlier step
  - Should autogenerate label of the format: `event-portal-v#.#`
- Deploy! 
  - Changes should appear after environment update has completed successfully



## References

- https://mherman.org/blog/developing-microservices-node-react-docker/
- https://github.com/mattpauldavies/nerp
- https://stackoverflow.com/questions/3370334/difference-between-acceptance-test-and-functional-test
- https://expressjs.com/en/guide/using-template-engines.html
- https://stackoverflow.com/questions/46872922/broken-c-std-libraries-on-macos-high-sierra-10-13/47401866
- https://medium.freecodecamp.org/expose-vs-publish-docker-port-commands-explained-simply-434593dbc9a3
- https://yarnpkg.com/en/docs/cli/run
- https://stackoverflow.com/questions/37929173/significance-of-port-3000-in-express-apps
- https://ux.stackexchange.com/questions/4752/search-vs-filter-what-is-the-difference
- https://stackoverflow.com/questions/27613724/need-to-create-an-api-doc-for-an-existing-application-written-with-nodejs-expres
- https://github.com/swagger-api/swagger-node
- https://swagger.io/swagger/media/blog/wp-content/uploads/2017/02/Documenting-An-Existing-API-with-Swagger-2.pdf
- https://stackoverflow.com/questions/26515473/writing-an-api-doc-for-swagger
- https://github.com/OAI/OpenAPI-Specification/tree/master/examples/v3.0
- https://scotch.io/tutorials/document-your-already-existing-apis-with-swagger
- https://www.reddit.com/r/docker/comments/8e9nj4/should_i_use_multiple_postgres_containers/
- https://stackoverflow.com/questions/38762709/one-or-multiple-databases-per-docker-container
- https://www.reddit.com/r/docker/comments/8tkq2v/one_database_container_for_everything_or_a/
- http://catlau.co/how-to-modularize-routes-with-the-express-router/
- Setting up React/Express with Docker-Compose
- https://stackoverflow.com/questions/40801772/what-is-the-difference-between-docker-compose-ports-vs-expose
- https://github.com/mrcoles/node-react-docker-compose
- https://daveceddia.com/deploy-react-express-app-heroku/
- https://github.com/jackall3n/millymollymandycakes.co.uk/blob/master/Dockerfile
- https://stackoverflow.com/questions/34896279/how-to-compile-scss-to-css-with-node-sass
- https://www.npmjs.com/package/node-sass
- https://github.com/remy/nodemon/issues/472
- https://stackoverflow.com/questions/30604846/docker-error-no-space-left-on-device
- https://medium.com/@xiaolishen/develop-in-docker-a-node-backend-and-a-react-front-end-talking-to-each-other-5c522156f634
- https://medium.com/thepeaklab/how-to-deploy-a-react-application-to-production-with-docker-multi-stage-builds-4da347f2d681
- https://stackoverflow.com/questions/50431144/how-do-i-get-my-react-app-to-point-to-my-node-express-api-in-production-proxy-o
- https://www.reddit.com/r/node/comments/8wagiz/is_nginx_required_for_an_express_api_server/
- https://www.reddit.com/r/node/comments/5jz60j/working_on_a_separate_api_expressjs_and_frontend/
- https://facebook.github.io/create-react-app/docs/deployment
- https://github.com/facebook/create-react-app/issues/1049
- https://stackoverflow.com/questions/23595282/error-no-default-engine-was-specified-and-no-extension-was-provided
- AWS EB
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/GettingStarted.html
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker_ecs.html
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-getting-started.html#ebcli3-basics-deploy
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/single-container-docker.html
- https://stackoverflow.com/questions/41265885/elastic-beanstalk-vs-ecs-for-multi-container-docker
- https://stackoverflow.com/questions/25832554/amazon-elastic-beanstalk-vs-ec2-instance-with-docker-containers?rq=1
- https://stackoverflow.com/questions/25956193/difference-between-amazon-ec2-and-aws-elastic-beanstalk
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-sourcebundle.html
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/GettingStarted.html?icmpid=docs_elasticbeanstalk_console
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/configuring-https-elb.html
- AWS Postgres
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.db.html
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-nodejs.rds.html#nodejs-rds-connect
- https://gist.github.com/syafiqfaiz/5273cd41df6f08fdedeb96e12af70e3b
- https://aws.amazon.com/getting-started/tutorials/create-connect-postgresql-db/
- https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.PostgreSQL.html
- https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html
- https://node-postgres.com/guides/project-structure
- https://node-postgres.com/features/pooling
- https://node-postgres.com/guides/async-express
- https://node-postgres.com/features/connecting
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/nodejs-getstarted.html
- https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.Connecting.AWSCLI.PostgreSQL.html
- https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ConnectToPostgreSQLInstance.html#USER_ConnectToPostgreSQLInstance.psql
- https://www.reddit.com/r/aws/comments/a75gfw/database_does_not_exist_when_connecting_to/
- https://forums.aws.amazon.com/thread.jspa?threadID=156069
- https://serverfault.com/questions/656079/unable-to-connect-to-public-postgresql-rds-instance
- https://stackoverflow.com/questions/30300830/load-env-file-in-makefile
- https://unix.stackexchange.com/questions/235223/makefile-include-env-file/235254
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create_deploy_docker.container.console.html
- https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/environments-cfg-softwaresettings.html?icmpid=docs_elasticbeanstalk_console
- https://stackoverflow.com/questions/10560241/how-to-use-nodemon-with-env-files
- https://stackoverflow.com/questions/25112510/how-to-set-environment-variables-from-within-package-json-node-js
- Local Database for Testing
- https://github.com/docker-library/postgres/issues/297
- https://stackoverflow.com/questions/50983177/how-to-connect-to-postgresql-using-docker-compose
- https://docs.docker.com/samples/library/postgres/#-via-docker-stack-deploy-or-docker-compose
- https://www.reddit.com/r/docker/comments/7v6tqc/use_local_postgresql_database_in_docker/
- https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach/52858101#52858101
- https://stackoverflow.com/questions/48350843/how-to-connect-from-docker-compose-to-host-postgresql
- https://stackoverflow.com/questions/44720694/how-to-connect-to-localhost-postgres-database-from-docker-container
- https://github.com/mjhea0/microservice-movies/blob/master/docker-compose.yml
- API Documentation Generation
- https://github.com/Surnet/swagger-jsdoc
- https://github.com/Surnet/swagger-jsdoc/blob/master/docs/GETTING-STARTED.md
- https://dev.to/akshendra/generating-documentation-on-the-fly-in-express-2652
- https://github.com/stallmanwotr/docker-compose-nodejs/blob/91acd2ed83e0209042f50a7844adb4f930763d7a/nodejs-rest-server/src/endpoints/ServerRouter.js
- https://github.com/cagria/swagger-jsdoc-test/blob/3669c696383dc92fc205d6e7be375779bab99d8a/app.js


