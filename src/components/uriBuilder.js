
/**
 * 
 * UriBuilder will be use to format uri building instead of appending long URIs before
 * sending to Axios.
 * 
 * @param basePath String
 */
module.exports.UriBuilder = class UriBuilder {
    constructor(basePath = "") {
        this.uri = ""
        this.uri += (basePath.includes("/") && this.uri != "" ? basePath.substring(1) : basePath) + "?"
        this.params = new URLSearchParams()
    }

    addQuery(key, value) {
        this.params.append(key, value)
        this.uri += `${(this.isNoQueryParam())}${key}=${value}`
        return this
    }

    addRaw(raw) {
        this.uri += `${(this.isNoQueryParam())}${raw}`
        return this
    }

    isNoQueryParam() {
        return (this.uri.substring(this.uri.length - 1) == "?" ? "" : "&")
    }

    getUri() {
        return this.uri
    }

    getParams() {
        return this.params
    }
}
