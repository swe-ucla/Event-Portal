# React Client



## Overview

TODO: the frontend



## Endpoints

##### Client - [http://localhost:8081](http://localhost:8081)

| Endpoint | HTTP Method | CRUD Method | Result                   |
| -------- | ----------- | ----------- | ------------------------ |
| /        | GET         | READ        | Render main/landing page |
| /login   | GET         | READ        | Render login page        |
| /logout  | GET         | READ        | Log a user out           |
| TODO     |             |             |                          |



## Local Development

- Instead of running the full stack, we can develop the React client locally.
- From `client/` install the necessary dependencies:
```bash
$ yarn install
```
- Start the app:
```bash
$ yarn start
```
- View the app at [http://localhost:3000](http://localhost:3000) in a browser.
- Exit the app in terminal with `Ctrl+C`



## Testing in Local Development

TODO: [Jest](https://facebook.github.io/jest/)? `yarn test`




## Standalone Docker

- Rather than running the full stack from root, we can run each service separately
- From `client/`:

```bash
$ docker build -t swedev-client .
$ docker run --rm --publish 8081:80 swedev-client
```
- View the React client at [http://localhost:8081](http://localhost:8081) in a browser
- Remove the image once finished:

```bash
$ docker rmi swedev-client
```
