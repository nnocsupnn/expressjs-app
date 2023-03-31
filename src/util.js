const { existsSync, mkdirSync } = require('fs')
const { join }  = require('path')
const rfs = require('rotating-file-stream')
const logFolder = process.env.LOG_FOLDER || join(process.cwd(), 'logs')

const config = {
    LOG_FORMAT: process.env.LOG_FORMAT || 'combined',
    LOG_SIZE: process.env.LOG_SIZE ||'10M',
    LOG_INTERVAL: process.env.LOG_INTERVAL ||'1d',
    LOG_MAX_FILES: parseInt(process.env.LOG_MAX_FILES ||10),
    REQUEST_CACHING_TTL: parseInt(process.env.REQUEST_CACHING || 30)
}


const getFileStream = (type, path) => {
    const logPath = path !== undefined ? path : logFolder
    const createFileName = (time, index) => {
        if (!time) {
            return `${type}-current.log`
        }

        let filename = time.toISOString().slice(0, 10);
        if (index > 1) {
            filename += `.${index}`;
        }

        return join(logPath, `${type}-${filename}.log.gz`);
    };

    return rfs.createStream(createFileName, {
        interval: config.LOG_INTERVAL,
        maxSize: config.LOG_SIZE,
        maxFiles: config.LOG_MAX_FILES,
        initialRotation: true,
        path: logPath,
        compress: 'gzip'
    })
}

/**
 * 
 * HTTP Status Codes
 */
const HttpStatus = {
    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,
    PROCESSING: 102,
    EARLY_HINTS: 103,
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NON_AUTHORITATIVE_INFORMATION: 203,
    NO_CONTENT: 204,
    RESET_CONTENT: 205,
    PARTIAL_CONTENT: 206,
    MULTI_STATUS: 207,
    ALREADY_REPORTED: 208,
    IM_USED: 226,
    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    USE_PROXY: 305,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    PROXY_AUTHENTICATION_REQUIRED: 407,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    LENGTH_REQUIRED: 411,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    URI_TOO_LONG: 414,
    UNSUPPORTED_MEDIA_TYPE: 415,
    RANGE_NOT_SATISFIABLE: 416,
    EXPECTATION_FAILED: 417,
    IM_A_TEAPOT: 418,
    MISDIRECTED_REQUEST: 421,
    UNPROCESSABLE_ENTITY: 422,
    LOCKED: 423,
    FAILED_DEPENDENCY: 424,
    TOO_EARLY: 425,
    UPGRADE_REQUIRED: 426,
    PRECONDITION_REQUIRED: 428,
    TOO_MANY_REQUESTS: 429,
    REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
    UNAVAILABLE_FOR_LEGAL_REASONS: 451,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
    HTTP_VERSION_NOT_SUPPORTED: 505,
    VARIANT_ALSO_NEGOTIATES: 506,
    INSUFFICIENT_STORAGE: 507,
    LOOP_DETECTED: 508,
    NOT_EXTENDED: 510,
    NETWORK_AUTHENTICATION_REQUIRED: 511
}

module.exports.isAsync = fn => {
    const AsyncFunc = (async () => {}).constructor;
    return fn instanceof AsyncFunc
}

module.exports.LogOption = {
    path: logFolder
}

module.exports.getFileStream = getFileStream
module.exports.config = config
module.exports.HttpStatus = HttpStatus