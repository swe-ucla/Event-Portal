FROM node:10

# Set . to /usr/app
WORKDIR /usr/app

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --network-timeout 100000

# Copy source code to image
COPY . .

# Run client in development mode
EXPOSE 3000
CMD ["yarn", "start"]
