/**
 * 
 * Dynamically require all js files ffrom specified folder.
 */

const fs = require("fs")
const path = require("path")

let modules = {}, dirPath = __dirname

fs.readdirSync(dirPath).forEach(file => {
    const filePath = path.join(dirPath, file)
    if (file.includes(".js") && !file.includes("index")) modules = { ...modules, ...require(filePath) }
})

module.exports = modules