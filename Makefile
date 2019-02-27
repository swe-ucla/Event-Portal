ECR_REPO=387893159857.dkr.ecr.us-east-1.amazonaws.com
REPO_NAME=swedev/event-portal
DEV_COMPOSE_FILE=./docker-compose-dev.yml

##########################      AWS / PRODUCTION      ##########################

# Authenticate Docker client
ecr-login:
	$(shell aws ecr get-login --no-include-email --region us-east-1)

# Build backend image
build:
	docker build -t $(REPO_NAME) .

# Login, build, and push latest image to AWS
push: ecr-login build
	docker tag $(REPO_NAME):latest $(ECR_REPO)/$(REPO_NAME):latest
	docker push $(ECR_REPO)/$(REPO_NAME):latest

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
# View server in browser at http://localhost.
run:
	docker build . -t $(REPO_NAME)
	docker run --rm --publish 80:80 $(REPO_NAME)

# Remove image once finished.
rm:
	docker rmi $(REPO_NAME)

# Stops running containers. Can manually stop containers from `docker ps`.
kill:
	-docker ps | tail -n +2 | cut -d ' ' -f 1 | xargs docker kill
