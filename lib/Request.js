"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _url = require("url");

var _querystring = require("querystring");

var _rawBody = require("raw-body");

var _rawBody2 = _interopRequireDefault(_rawBody);

var _formidable = require("formidable");

var _formidable2 = _interopRequireDefault(_formidable);

var _accepts = require("accepts");

var _accepts2 = _interopRequireDefault(_accepts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Request {
    constructor(serverRequest) {
        this.serverRequest = serverRequest;

        this.url = serverRequest.url;

        this.urlParts = (0, _url.parse)(this.url);
        this._query = null;

        this.parameters = {};

        this.fields = null;

        this.files = null;

        this.rawBody = null;

        this.accept = (0, _accepts2.default)(serverRequest);
    }

    get method() {
        return this.serverRequest.method;
    }

    get protocol() {
        return this.urlParts.protocol;
    }

    get host() {
        return this.urlParts.host;
    }

    get hostname() {
        return this.urlParts.hostname;
    }

    get port() {
        return this.urlParts.port;
    }

    get pathname() {
        return this.urlParts.pathname;
    }

    get pathname() {
        return this.urlParts.pathname;
    }

    get queryString() {
        return this.urlParts.query;
    }

    get query() {
        if (this._query) {
            return this._query;
        }

        this._query = (0, _querystring.parse)(this.queryString);

        return this._query;
    }

    get hash() {
        return this.urlParts.hash;
    }

    getHeader(name) {
        name = name.toLowerCase();
        return this.serverRequest.headers[name];
    }

    getParameter(name) {
        return this.parameters[name];
    }

    setParameter(name, value) {
        this.parameters[name] = value;
    }

    *getRawBody(options) {
        if (this.rawBody !== null) {
            return this.rawBody;
        }

        var rawBody = yield (0, _rawBody2.default)(this.serverRequest, options);
        this.rawBody = rawBody;
        return rawBody;
    }

    *getFields() {
        if (this.fields !== null) {
            return this.fields;
        }

        var data = yield this.getFieldsAndFiles();
        return data.fields;
    }

    *getFiles() {
        if (this.files !== null) {
            return this.files;
        }

        var data = yield this.getFieldsAndFiles();
        return data.files;
    }

    *getFieldsAndFiles() {
        if (this.fields !== null && this.fields !== null) {
            return {
                fields: this.fields,
                files: this.files
            };
        }

        var self = this;
        return new Promise(function (resolve, reject) {
            var form = _formidable2.default.IncomingForm();
            form.parse(self.serverRequest, function (error, fields, files) {
                if (error) {
                    reject(error);
                    return;
                }

                self.fields = fields;
                self.files = files;
                resolve({
                    fields: fields,
                    files: files
                });
            });
        });
    }

    acceptsCharsets() {
        for (var _len = arguments.length, charsets = Array(_len), _key = 0; _key < _len; _key++) {
            charsets[_key] = arguments[_key];
        }

        return this.accept.charset(charsets);
    }

    charsets() {
        return this.accept.charsets();
    }

    acceptsEncodings() {
        for (var _len2 = arguments.length, encodings = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            encodings[_key2] = arguments[_key2];
        }

        return this.accept.encoding(encodings);
    }

    encodings() {
        return this.accept.encodings();
    }

    acceptsLanguages() {
        for (var _len3 = arguments.length, languages = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            languages[_key3] = arguments[_key3];
        }

        return this.accept.language(languages);
    }

    languages() {
        return this.accept.languages();
    }

    acceptsTypes() {
        for (var _len4 = arguments.length, types = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            types[_key4] = arguments[_key4];
        }

        return this.accept.type(types);
    }

    types() {
        return this.accept.types();
    }
}
exports.default = Request;
module.exports = exports['default'];