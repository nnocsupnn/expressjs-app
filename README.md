## ExpressJS API - Custom Implementation

: This project was intially developed to customized and ease the usage of configuring express framework.

---

## Installation

```bash
npm install expressjs-app
```

## Usage

```javascript
const { ExpressApi, LogOption } = require("expressjs-app")

const app = (router, ...args) => {
    router.get('/', (req, res) => {
        res.json({
            status: 200,
            message: "Hello, Shits!"
        })
    })

    return router
}

const headers = (req, res, next) => {
    res.set('Access-Control-Allow-Methods', 'GET,POST');
    next()
}

const unauthorize = (err, req, res, next) => {
    if (err.name === 'AuthenticationError') {
        // Send a customized response for authentication failure
        return res.status(err.status).json({ 
            status: err.status,
            message: 'Invalid Authorization header supplied.\nPlease contact support or check your credentials.'
        })
    }

    next()
}

const apiOptions = { 
    enableCors: true, 
    // lastRouteHandler: invalid, // Method for handling 404 not found routes
    // docsModule: swaggerDoc, // Swagger Docs
    enableLog: true, // Log option can also accept LogOption { path: '/logs' }
    // jwtStrategy: jwtStrategy // JWT Strategy, this package uses passport-jwt for authentication, if this provided as option make sure you enable `registerAuthenticationRoute`
}

const apiInstance = new ExpressApi(apiOptions)
apiInstance.registerRoutesGroup(
        "/api",
        {
            method: app, args: undefined, name: 'app'
        }
    )
    .registerMiddlewares(headers, unauthorize)
    // Start the API/App
    .start(async () => {
        console.log('Server Started')
    })

```

---

## Configuration

```env
NODE_ENV=staging
API_BASE_PATH=/
SECRET_KEY=pass123!
PORT=3000

# OPTIONAL
LOG_FORMAT=combined # default 'combined',
LOG_SIZE='10M' # default '10M',
LOG_INTERVAL='1d' # default '1d',
LOG_MAX_FILES=10 # default 10
```
