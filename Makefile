# Include Environment Variables from .env file
include .env 

##########################      AWS / PRODUCTION      ##########################

# Authenticate Docker client
ecr-login:
	$(shell aws ecr get-login --no-include-email --region us-east-1)

# Build backend image
build:
	docker build -t $(REPO) .

# Login, build, and push latest image to AWS
push: ecr-login build
	docker tag $(REPO):latest $(ECR_REPO)/$(REPO):latest
	docker push $(ECR_REPO)/$(REPO):latest

#########################       LOCAL DEVELOPMENT     ##########################

# Creates a static build of the React client app. The Express server handles
# both the API and serving the static client files.
prod:
	docker-compose up --build

# Builds and runs the stack locally. Builds the client and server images if 
# they do not already exist and starts the containers.
dev:
	docker-compose -f $(DEV_COMPOSE_FILE) up --build

# Stops the stack. Can also Ctrl+C in the same terminal window stack was run.
# NOTE: Ctrl+C may not tear down the containers and free the ports.
stop:
	docker-compose down

#########################       STANDALONE DOCKER     ##########################

# Build and run event portal image. 
# View server in browser at http://localhost:$(APP_PORT).
run:
	docker build . -t $(REPO)
	docker run --rm --publish $(APP_PORT):$(APP_PORT) $(REPO)

# Remove image once finished.
rm:
	docker rmi $(REPO)

# Stops running containers. Can manually stop containers from `docker ps`.
kill:
	-docker ps | tail -n +2 | cut -d ' ' -f 1 | xargs docker kill

# This will remove:
#        - all stopped containers
#        - all networks not used by at least one container
#        - all dangling images
#        - all build cache
prune:
	docker system prune

#######################       AWS RDS for Postgres     #########################

# Connect via shell to Postgres database.
db:
	psql \
	   --host=$(PGHOST) \
	   --port=$(PGPORT) \
	   --username=$(PGUSER) \
	   --password \
	   --dbname=$(PGDATABASE) \

