const { existsSync, mkdirSync } = require('fs')
const { join }  = require('path')
const rfs = require('rotating-file-stream')

const config = {
    LOG_FORMAT: process.env.LOG_FORMAT || 'combined',
    LOG_SIZE: process.env.LOG_SIZE ||'10M',
    LOG_INTERVAL: process.env.LOG_INTERVAL ||'1d',
    LOG_MAX_FILES: parseInt(process.env.LOG_MAX_FILES ||10),
    REQUEST_CACHING_TTL: parseInt(process.env.REQUEST_CACHING || 30)
}


const getFileStream = (type) => {
    const dirPath = join(process.cwd(), 'logs')
    const createFileName = (time, index) => {
        if (!time) {
            return `${type}-current.log`
        }

        let filename = time.toISOString().slice(0, 10);
        if (index > 1) {
            filename += `.${index}`;
        }

        return `${type}-${filename}.log.gz`;
    };

    return rfs.createStream(createFileName, {
        interval: config.LOG_INTERVAL,
        maxSize: config.LOG_SIZE,
        maxFiles: config.LOG_MAX_FILES,
        initialRotation: true,
        path: dirPath,
        compress: 'gzip'
    })
}

module.exports.getFileStream = getFileStream
module.exports.config = config