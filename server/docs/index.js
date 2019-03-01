var swaggerJSDoc = require('swagger-jsdoc');
var swaggerUi = require('swagger-ui-express');

var express = require('express');
var router = express.Router();

// Reusable components
const components = {
  responses: {
    // 404: Not Found
    NotFound: {
      description: 'Not Found',
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Error'
          }
        }
      }
    }
  },
  schemas: {
    Error: {
      type: 'object',
      properties: {
        'code': {
          type: 'int',
          example: 666
        },
        'message': {
          type: 'string',
          example: 'Error Message'
        }
      }
    }
  }
}

 // Header for generating Swagger documentation
const options = {
  definition: {
    openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'Event Portal API Server', // Title (required)
      description: 'Swagger Documentation for the SWE Event Portal REST API',
      version: '1.0.0', // Version (required)
    },
    components: components,
  },
  // Path to the API routes relative to server/ (the directory from which 
  // Node is run)
  apis: ['./routes/index.js', './routes/swe.js'],
  // apis: ['./routes/*.js'],
};

// Initializes swagger-jsdoc, generates @swagger annotations in JSON format
const swaggerSpec = swaggerJSDoc(options);

// Serves the REST API documentation using Swagger UI
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerSpec));

// Returns the REST API documentation/Swagger Spec as JSON
router.get('/json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

module.exports = router;
