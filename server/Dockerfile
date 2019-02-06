## 0. install dependencies ##

FROM node:9.2.0-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN yarn install --non-interactive --production=true


## 1. serve application ##

FROM node:9.2.0-alpine

WORKDIR /app

COPY . /app
COPY --from=0 /app/node_modules /app/node_modules

EXPOSE 3000

ENTRYPOINT ["yarn", "start"]
