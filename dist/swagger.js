const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Defina as opções do Swagger JSDoc
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API',
      version: '1.0.0',
      description: 'Documentação da API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Onde o Swagger JSDoc vai buscar os comentários
};

// Gera a especificação Swagger
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Exporta a configuração do Swagger
module.exports = {
  swaggerUi,
  swaggerSpecs,
};