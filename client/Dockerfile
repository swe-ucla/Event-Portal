## 0. install dependencies ##

FROM nginx:1.13.7-alpine

WORKDIR /app

COPY package.json /app/package.json
COPY yarn.lock /app/yarn.lock

RUN \
    apk add --update nodejs && \
    npm install -g yarn && \
    yarn install --non-interactive --production=true


## 1. install dependencies ##

FROM nginx:1.13.7-alpine

WORKDIR /app

COPY . /app
COPY --from=0 /app/node_modules /app/node_modules

RUN \
    apk add --update nodejs && \
    npm install -g yarn && \
    yarn build


## 2. serve application ##

FROM nginx:1.13.7-alpine

WORKDIR /app

COPY --from=1 /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=1 /app/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=1 /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
