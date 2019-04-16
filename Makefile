# Include Environment Variables from .env file
include .env 

#########################       LOCAL DEVELOPMENT     ##########################

# Builds and runs the stack locally. Builds the client and server images if 
# they do not already exist and starts the containers.
dev:
	docker-compose -f $(DEV_COMPOSE_FILE) up --build

# Creates and runs a static production build of the React client app. The 
# Express server handles both the API and serving the static client files. 
prod:
	docker-compose up --build

# Stops the stack. Can also Ctrl+C in the same terminal window stack was run.
# NOTE: Ctrl+C may not tear down the containers and free the ports. If so, use
# `kill` target in another window.
stop:
	docker-compose down

# Sets CONTAINER_ID variable with ID of postgres container.
# := means CONTAINER_ID will only be set if output is non-empty.
# -q option for quiet output with only the container ID.
# -f option to filter by image name.
CONTAINER_ID := $(shell docker ps -qf "name=$(POSTGRES_IMAGE)")

# Dependency of `pg` target that requires CONTAINER_ID to be set.
check-id:
ifndef CONTAINER_ID
	$(error CONTAINER_ID is undefined. Try `make ps` and modify POSTGRES_IMAGE in .env file.)
endif

# Connects to psql shell of Postgres container when running `dev` target.
pg: check-id
	docker exec -ti $(CONTAINER_ID) psql -U $(POSTGRES_USER)

##################       AWS Elastic Beanstalk Deployment     ##################

# Dependency of `zip` target that requires VERSION to be set.
check-version:
ifndef VERSION
	$(error VERSION is undefined)
endif

# Bundle application code and move to versions folder
# Specify VERSION by passing environment variable with call
# $ make zip VERSION=4.2
zip: check-version
	git archive -v -o ./versions/event_portal_v$(VERSION).zip --format=zip HEAD

#####################       Amazon RDS for PostgreSQL     ######################

# Connect via shell to Postgres database.
db:
	psql \
	   --host=$(PGHOST) \
	   --port=$(PGPORT) \
	   --username=$(PGUSER) \
	   --password \
	   --dbname=$(PGDATABASE) \

#########################       STANDALONE DOCKER     ##########################

# Build and run event portal image. 
# View server in browser at http://localhost:$(APP_PORT).
run:
	docker build . -t $(REPO)
	docker run --rm --publish $(APP_PORT):$(APP_PORT) $(REPO)

# Remove image once finished.
rm:
	docker rmi $(REPO)

# Lists containers with their IDs, image names, status, etc.
ps:
	docker ps

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

