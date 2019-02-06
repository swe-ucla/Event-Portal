ECR_REPO=387893159857.dkr.ecr.us-east-1.amazonaws.com
REPO_NAME=swedev/server

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

# One-time only: install necessary dependencies.
install:
	yarn install

# Start the app. View app in browser at http://localhost:3000. Exit with Ctrl+C.
dev:
	yarn start 

#########################       STANDALONE DOCKER     ##########################

# Build and run server image. 
# View server in browser at http://localhost:3000.
run:
	docker build . -t $(REPO_NAME)
	docker run --rm --publish 3000:3000 $(REPO_NAME)

# Remove image once finished.
rm:
	docker rmi $(REPO_NAME)

# Stops running containers. Shouldn't be needed, but easier than manually
# stopping containers from `docker ps`.
kill:
	-docker ps | tail -n +2 | cut -d ' ' -f 1 | xargs docker kill
