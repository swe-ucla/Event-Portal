DEV_COMPOSE_FILE=./docker-compose-dev.yml

# Runs the latest pushed images in AWS ECR.
run:
	docker-compose up

# Builds and runs the stack locally. 
# Builds the images if they do not already exist and starts the containers.
dev:
	docker-compose -f $(DEV_COMPOSE_FILE) up --build 

# Stops the stack. Can also Ctrl+C in the same terminal window stack was run.
stop:
	docker-compose down

# Stops running containers. Shouldn't be needed, but easier than manually
# stopping containers from `docker ps`.
kill:
	-docker ps | tail -n +2 | cut -d ' ' -f 1 | xargs docker kill
