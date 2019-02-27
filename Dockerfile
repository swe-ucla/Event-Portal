### Setup and build the React Client ###

FROM node:10 as client

# Set . to /usr/app/client/
WORKDIR /usr/app/client/

# Install dependencies
COPY client/package.json .
COPY client/yarn.lock .
RUN yarn install

# Copy client source code to image
COPY client/ .

# Build production code
RUN yarn build


### Setup the Express Server ###

FROM node:10

# Set . to /usr/app/
WORKDIR /usr/app/

# Copy static files from production build of React Client
COPY --from=client /usr/app/client/build/ ./client/build/

# Set . to /usr/app/server/
WORKDIR /usr/app/server/

# Install dependencies
COPY server/package.json .
COPY server/yarn.lock .
RUN yarn install

# Copy server source code to image
COPY server/ .

# Run Express server to handle API and React Client
ENV PORT 80
EXPOSE 80
CMD ["yarn", "start"]
