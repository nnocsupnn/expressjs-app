const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

module.exports.Swagger = class Swagger {
    constructor(config) {
        this.config = config
    }

    serveDocs (app) {
        const swaggerSpec = swaggerJSDoc(this.config);
        app.use(`${process.env.API_BASE_PATH || ''}/docs/spec.json`, (req, res) => res.json(swaggerSpec))
        app.use(`${process.env.API_BASE_PATH || ''}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            swaggerOptions: {
                urls: [
                    {
                        name: 'Spec',
                        url: 'spec.json'
                    }
                ]
            }
        }));
        
        return app
    }
}