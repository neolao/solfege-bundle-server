'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Response {
    constructor(serverResponse) {
        this.serverResponse = serverResponse;

        this.getHeader = serverResponse.getHeader.bind(serverResponse);
        this.setHeader = serverResponse.setHeader.bind(serverResponse);
        this.removeHeader = serverResponse.removeHeader.bind(serverResponse);

        this.parameters = {};
    }

    get statusCode() {
        return this.serverResponse.statusCode;
    }
    set statusCode(value) {
        this.serverResponse.statusCode = value;
    }

    get statusString() {
        return _http2.default.STATUS_CODES[this.statusCode];
    }

    get headerSent() {
        return this.serverResponse.headersSent;
    }

    get body() {
        return this._body;
    }
    set body(value) {
        this._body = value;

        if (null === value) {
            this.removeHeader('Content-Type');
            this.removeHeader('Content-Length');
            this.removeHeader('Transfer-Encoding');
            return;
        }
    }

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