# API Servers



## Overview

TODO: the backend



## Documentation

- REST API Documentation is generated using [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc).
- Swagger is integrated by parsing [JSDoc](http://usejsdoc.org/) comments in `server/routes/` files and outputting an OpenAPI (Swagger) specification.
  - Documentation regarding comment structure/specification can be found [here](https://swagger.io/docs/specification/basic-structure/).
- Viewing API documentation 

|           Mode           |         Swagger UI          |       Swagger Spec (JSON)        |
| :----------------------: | :-------------------------: | :------------------------------: |
| Development (`make dev`) | [http://localhost:5000/docs](http://localhost:5000/docs)  | [http://localhost:5000/docs/json](http://localhost:5000/docs/json)  |
| Production (`make prod`) |    [http://localhost/docs](http://localhost/docs)    |    [http://localhost/docs/json](http://localhost/docs/json)    |
|         Deployed         | [http://www.sweucla.com/docs](http://www.sweucla.com/docs) | [http://www.sweucla.com/docs/json](http://www.sweucla.com/docs/json) |

