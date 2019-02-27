FROM node:10

# Set . to /usr/app
WORKDIR /usr/app

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install

# Copy source code to image
COPY . .

# Run server
EXPOSE 5000
CMD ["yarn", "start"]
