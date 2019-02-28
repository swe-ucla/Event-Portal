# Include Environment Variables from .env file
include ../.env 

#########################       LOCAL DEVELOPMENT     ##########################

# One-time only: install necessary dependencies.
install:
	yarn install

# Start the app. View app in browser at http://localhost:$(API_SERVER_PORT). Exit with Ctrl+C.
dev:
	yarn start 

#########################       STANDALONE DOCKER     ##########################

# Build and run server image. 
# View server in browser at http://localhost:$(API_SERVER_PORT).
run:
	docker build . -t $(SERVER_REPO)
	docker run --rm --publish $(API_SERVER_PORT):$(API_SERVER_PORT) $(SERVER_REPO)

# Remove image once finished.
rm:
	docker rmi $(SERVER_REPO)

# Stops running containers. Shouldn't be needed, but easier than manually
# stopping containers from `docker ps`.
kill:
	-docker ps | tail -n +2 | cut -d ' ' -f 1 | xargs docker kill
