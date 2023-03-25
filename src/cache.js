const mcache = require('memory-cache')

module.exports.cache = (duration, successStatus = 200) => {
    return (req, res, next) => {
        let key = '__express__' + req.originalUrl || req.url
        let cacheBody = mcache.get(key)

        if (cacheBody) {
            res.send(cacheBody)
            return
        } else {
            res.sendResponse = res.json
            res.json = body => {
                mcache.put(key, body, duration * 1000)
                res.status(successStatus).sendResponse(body)
            }
        }

        next()
    }
}