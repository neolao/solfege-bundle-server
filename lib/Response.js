"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serverResponse = Symbol();
var body = Symbol();

var Response = class Response {
    constructor(serverResponse) {
        this[serverResponse] = serverResponse;

        this.parameters = {};
    }

    getServerResponse() {
        return this[serverResponse];
    }

    setHeader(name, value) {
        this.getServerResponse().setHeader(name, value);
    }

    getHeader(name) {
        return this.getServerResponse().getHeader(name);
    }

    removeHeader(name) {
        this.getServerResponse().removeHeader(name);
    }

    getStatusCode() {
        return this.getServerResponse().statusCode;
    }

    setStatusCode(value) {
        this.getServerResponse().statusCode = value;
    }

    get statusCode() {
        return this.getStatusCode();
    }
    set statusCode(value) {
        this.setStatusCode(value);
    }

    getStatusString() {
        var statusCode = this.getStatusCode();
        return _http2.default.STATUS_CODES[statusCode];
    }

    get statusString() {
        return this.getStatusString();
    }

    areHeadersSent() {
        return this.getServerResponse().headersSent;
    }

    get headerisSent() {
        return this.areHeadersSent();
    }

    setBody(value) {
        this[body] = value;

        if (null === value) {
            this.removeHeader('Content-Type');
            this.removeHeader('Content-Length');
            this.removeHeader('Transfer-Encoding');
            return;
        }
    }

    getBody() {
        return this[body];
    }

    get body() {
        return this.getBody();
    }
    set body(value) {
        this.setBody(value);
    }

    getLength() {
        var serverResponse = this.getServerResponse();
        var length = serverResponse._headers["content-length"];
        return ~~length;
    }

    setLength(value) {
        this.setHeader("Content-Length", String(value));
    }

    get length() {
        return this.getLength();
    }
    set length(value) {
        this.setLength(value);
    }
};
exports.default = Response;
module.exports = exports["default"];