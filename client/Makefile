# Include Environment Variables from .env file
include ../.env 

#########################       LOCAL DEVELOPMENT     ##########################

# One-time only: install necessary dependencies.
install:
	yarn install

# Start the app. View app in browser at http://localhost:$(REACT_CLIENT_PORT). Exit with Ctrl+C.
# Since server is not running, cannot proxy API calls.
dev:
	yarn start 

#########################       STANDALONE DOCKER     ##########################

# Build and run client image. 
# View React client in browser at http://localhost:$(REACT_CLIENT_PORT).
run:
	docker build . -t $(CLIENT_REPO)
	docker run --rm --publish $(REACT_CLIENT_PORT):$(REACT_CLIENT_PORT) $(CLIENT_REPO)

# Remove image once finished.
rm:
	docker rmi $(CLIENT_REPO)

# Stops running containers. Shouldn't be needed, but easier than manually
# stopping containers from `docker ps`.
kill:
	-docker ps | tail -n +2 | cut -d ' ' -f 1 | xargs docker kill
