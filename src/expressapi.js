const express = require('express');
const passport = require('passport');
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { getFileStream, config, isAsync, LogOption } = require('./util');
/**
 * 
 * ## Implementation expressJS for custom use
 * @author Nino Casupananq
 * 
 * @param enableCors If cors will be enabled
 * @param lastRouteHandler last route handler registration
 * @param docsModule module for the documentation - only available for Swagger docs
 * @param enableLog flag to enable or disable log. Default is `false`
 */
module.exports = class ExpressApi {
    constructor({ enableCors, lastRouteHandler, docsModule, enableLog, jwtStrategy } = { enableCors: true, lastRouteHandler: (req, res) => {}, docsModule: (server) => {}, enableLog: LogOption(), jwtStrategy: undefined }) {
        this.server = express()
        this.port = process.env.PORT || 3000
        this.router = express.Router()
        this.groupRouters = {}
        this.passport = passport
        this.lastRouteHandler = undefined
        this.jwtStrategy = undefined

        if (enableCors) this.server.use(cors())
        if (typeof lastRouteHandler === 'function') this.lastRouteHandler = lastRouteHandler
        if (typeof docsModule === 'function') {
            docsModule(this.server)
            console.info(`[${process.env.NODE_ENV}][ExpressApi] Registered docs`)
        }

        if (jwtStrategy != undefined) {
            this.jwtStrategy = jwtStrategy
        }

        // Helment adds required security headers in the middleware
        this.server.use(helmet())

        // The express.json() function is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
        this.server.use(express.json())

        if (enableLog == true) {
            // Register logger
            this.createLogFor('access')
            this.createLogFor('error')
            console.info(`[${process.env.NODE_ENV}][ExpressApi] Logging enabled.`)
        } else if (enableLog instanceof LogOption.constructor) {
            this.createLogFor('access', enableLog.path)
            this.createLogFor('error', enableLog.path)
            console.info(`[${process.env.NODE_ENV}][ExpressApi] Logging enabled.`)
        }
    }


    createLogFor(type = 'access', path = undefined) {
        // const logFile = createWriteStream(`./${type}.log`, { flags: 'a' });

        const options = { stream: getFileStream(type, path) }

        options.skip = function (req, res) {
            return res.statusCode > 301
        }

        if (type.includes('err')) options.skip = function (req, res) { return res.statusCode < 301 }
        this.server.use(morgan(config.LOG_FORMAT, options))
    }


    /**
     * ### Register routes
     * @param {*} route pass the route method that accepts `Router` as argument
     * @param  {*} args Additional arguments for the route method as Object
     * @param {*} name Name a route
     * @returns ExpressApi
     * 
     * @example
     * ```javascript
     * 
     * const route = (router) => {
     *      router.get('/', (req, res) => {
     *          // process
     *      })
     *      
     *      // return router is required.
     *      return router
     * }
     * 
     * const api = new ExpressApi();
     * api.registerRoutes(route).start()
     * ```
     */
    registerRoutes(...routes) {
        // route = () => {}, args = {}, name
        routes.map(route => {
            this.router = route.method(this.router, route.args)
            console.log(`[${process.env.NODE_ENV}][ExpressApi] ${route.name || 'RouteName'} - route is registered.`)
        })

        return this
    }

    /**
     * Route Groups is best for organizing routes and handlers
     * @param {*} baseUri 
     * @param  {...any} routes 
     * @returns 
     * 
     * @example
     * ```javascript
     * const route1 = (router) => {
     *      router.get('/', (req, res) => {
     *          // process
     *      })
     *      
     *      // return router is required.
     *      return router
     * }
     * 
     * const route2 = (router) => {
     *      router.get('/', (req, res) => {
     *          // process
     *      })
     *      
     *      // return router is required.
     *      return router
     * }
     * 
     * const api = new ExpressApi();
     * api.registerRouteGroup('/v1/api', route1, route2).start()
     * ```
     */
    registerRoutesGroup(baseUri = '/api', ...routes) {
        let router = express.Router()
        routes.forEach(route => {
            router = route.method(router, route.args)
            console.log(`[${process.env.NODE_ENV}][ExpressApi] ${route.name || 'RouteName'} - route is registered.`)
        })

        console.info(`[${process.env.NODE_ENV}][ExpressApi] Configured baseUri ${baseUri}`)

        // Add router
        this.groupRouters[baseUri] = router

        return this
    }


    /**
     * ### Register authentication - Call this method if you want to add the authentication otherwise dont use.
     * @param {*} authRoute pass the auth route that accepts `express()` instance. To exclude the auth route.
     * @param {*} protectExpr set the protected path - wildcard
     * @returns ExpressApi
     * 
     * @example
     * 
     * ```javascript
     * const authRoute = (server) => {
     *      server.post('/authenticate', (req, res) => {
     *          // authenticate user
     *      })
     * }
     * 
     * const api = new ExpressApi();
     * api.registerAuthentication(authRoute, '/api/*').start()
     * ```
     */
    registerAuthenticationRoute(baseUri = '/api', authRoute = () => { }, protectExpr = "*") {
        if (this.jwtStrategy == undefined) throw Error("jwtStrategy is not properly defined.")
        // this.server.use(express.json());
        this.server.use(this.passport.initialize());
        this.passport = this.passport.use(this.jwtStrategy)

        this.server = authRoute(baseUri, this.server)

        this.server.all((protectExpr.includes("*") ? protectExpr : `${protectExpr}**`), this.passport.authenticate('jwt', { session: false, failWithError: true }))
        
        console.log(`[${process.env.NODE_ENV}][ExpressApi] Authentication is configured to this path: ${protectExpr}`)

        return this
    }


    /**
     * ### Register a middleware - `app.use`
     * @param {*} cb function to register
     * @returns ExpressApi
     * 
     * @example
     * 
     * ```javascript
     * const api = new ExpressApi();
     * api.registerMiddleware((req, res, next) => {
     *      // process
     * }).start()
     * ```
     */
    registerMiddlewares(...args) {
        args.map(fn => this.server.use(fn))
        return this
    }

    /**
     * ### Start the server instance
     * @param {*} callback set the callback for `listen`
     * @param {*} port port of the server
     */
    start(callback = async () => { }, port = 0) {
        if (port != 0) this.port = port

        for (let uri in this.groupRouters) {
            this.server.use(uri, this.groupRouters[uri])
        }

        if (this.lastRouteHandler !== undefined && typeof this.lastRouteHandler === 'function') this.server.use(this.lastRouteHandler)

        this.server.listen(this.port, async () => {
            console.log(`[${process.env.NODE_ENV}][ExpressApi] API Started @ port ${this.port}`)
            
            if (isAsync(callback)) {
                await callback()
            } else {
                callback()
            }
        })
    }
}