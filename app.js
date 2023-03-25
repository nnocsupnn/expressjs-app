const expressApi = require("./src/expressapi")
module.exports = expressApi


// process.env.NODE_ENV='staging'
// process.env.SECRET_KEY='pass123!'
// process.env.PORT=3003

// const { ExpressApi } = expressApi
// const app = (router, ...args) => {
//     router.get('/', (req, res) => {
//         setTimeout(() => {}, 3000)
//         res.json({
//             status: 200,
//             message: "Hello, Shits!"
//         })
//     })

//     return router
// }

// const headers = (req, res, next) => {
//     res.set('Access-Control-Allow-Methods', 'GET,POST');
//     next()
// }

// const unauthorize = (err, req, res, next) => {
//     if (err.name === 'AuthenticationError') {
//         // Send a customized response for authentication failure
//         return res.status(err.status).json({ 
//             status: err.status,
//             message: 'Invalid Authorization header supplied.\nPlease contact support or check your credentials.'
//         })
//     }

//     next()
// }

// const apiOptions = { 
//     enableCors: true, 
//     enableLog: true
// }

// const apiInstance = new ExpressApi(apiOptions)
// apiInstance.registerRoutesGroup(
//         "/api",
//         {
//             method: app, args: undefined, name: 'app', cacheEnabled: true
//         }
//     )
//     .registerMiddlewares(headers, unauthorize)
//     // Start the API/App
//     .start(async () => {
        
//     })