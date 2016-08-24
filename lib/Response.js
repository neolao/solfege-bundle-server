'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A response
 */
class Response {
    /**
     * Constructor
     *
     * @param   {Object}    serverResponse      The original response
     */
    constructor(serverResponse) {
        // Save the original response
        this.serverResponse = serverResponse;

        // Copy some functions and informations
        this.getHeader = serverResponse.getHeader.bind(serverResponse);
        this.setHeader = serverResponse.setHeader.bind(serverResponse);
        this.removeHeader = serverResponse.removeHeader.bind(serverResponse);

        // Set default values
        this.parameters = {};
    }

    /**
     * The status code
     *
     * @type {Number}
     * @api public
     */
    get statusCode() {
        return this.serverResponse.statusCode;
    }
    set statusCode(value) {
        this.serverResponse.statusCode = value;
    }

    /**
     * The status string
     *
     * @type {String}
     * @api public
     */
    get statusString() {
        return _http2.default.STATUS_CODES[this.statusCode];
    }

    /**
     * Indicates that the headers are sent
     *
     * @type {Boolean}
     * @api public
     */
    get headerSent() {
        return this.serverResponse.headersSent;
    }

    /**
     * The response body
     *
     * @type {any}
     * @api public
     */
    get body() {
        return this._body;
    }
    set body(value) {
        this._body = value;

        // No content
        if (null === value) {
            this.removeHeader('Content-Type');
            this.removeHeader('Content-Length');
            this.removeHeader('Transfer-Encoding');
            return;
        }
    }

    /**
     * The body length
     *
     * @type {Number}
     * @api public
     */
    get length() {
        var length = this.serverResponse._headers['content-length'];

        return ~~length;
    }
    set length(value) {
        this.setHeader('Content-Length', value);
    }
}
exports.default = Response;
module.exports = exports['default'];