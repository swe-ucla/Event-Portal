# API Servers



## Overview

TODO: the backend



## Testing and Documentation

- REST API Documentation is generated with [Postman Documentation](https://learning.getpostman.com/docs/postman/api_documentation/intro_to_api_documentation/)
  - View the documentation here: [Event Portal API Documentation](https://documenter.getpostman.com/view/7114944/S17xqkTQ)
- Tests are done using [Postman Testing](https://learning.getpostman.com/docs/postman/scripts/test_scripts/)
  - View the (potentially outdated) Collection here: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/46d969ba9fa943b91bbc) 

##### Deprecated Documentation

- REST API Documentation is generated using [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc).
- Swagger is integrated by parsing [JSDoc](http://usejsdoc.org/) comments in `server/routes/` files and outputting an OpenAPI (Swagger) specification.
  - Documentation regarding comment structure/specification can be found [here](https://swagger.io/docs/specification/basic-structure/).
- Viewing API documentation 

|           Mode           |         Swagger UI          |       Swagger Spec (JSON)        |
| :----------------------: | :-------------------------: | :------------------------------: |
| Development (`make dev`) | [http://localhost:5000/docs](http://localhost:5000/docs)  | [http://localhost:5000/docs/json](http://localhost:5000/docs/json)  |
| Production (`make prod`) |    [http://localhost/docs](http://localhost/docs)    |    [http://localhost/docs/json](http://localhost/docs/json)    |
|         Deployed         | [http://www.sweucla.com/docs](http://www.sweucla.com/docs) | [http://www.sweucla.com/docs/json](http://www.sweucla.com/docs/json) |

