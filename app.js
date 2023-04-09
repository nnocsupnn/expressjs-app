/**
 * ExpressJS API
 * 
 * @author Nino Casupananq
 * @memberof Medicard
 */

const { HttpStatus, LogOption } = require("./src/util")
const ExpressApi = require("./src/expressapi")


// Exports
module.exports.HttpStatus = HttpStatus
module.exports.ExpressApi = ExpressApi
module.exports.LogOption = LogOption
// Export all component class
module.exports.components = require('./src/components')