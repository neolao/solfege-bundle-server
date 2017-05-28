"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _url = require("url");

var _querystring = require("querystring");

var _rawBody = require("raw-body");

var _rawBody2 = _interopRequireDefault(_rawBody);

var _formidable = require("formidable");

var _formidable2 = _interopRequireDefault(_formidable);

var _accepts = require("accepts");

var _accepts2 = _interopRequireDefault(_accepts);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var serverRequest = Symbol();
var url = Symbol();
var urlParts = Symbol();
var query = Symbol();
var accept = Symbol();
var parameters = Symbol();
var fields = Symbol();
var files = Symbol();
var rawBody = Symbol();

var Request = class Request {
    constructor(serverRequest) {
        this[serverRequest] = serverRequest;

        this[url] = serverRequest.url;

        this[urlParts] = (0, _url.parse)(this.url);

        this[query] = null;

        this[parameters] = {};

        this[fields] = null;

        this[files] = null;

        this[rawBody] = null;

        this[accept] = (0, _accepts2.default)(serverRequest);
    }

    getServerRequest() {
        return this[serverRequest];
    }

    getMethod() {
        return this.getServerRequest().method;
    }

    getProtocol() {
        return this[urlParts].protocol;
    }

    getHost() {
        return this[urlParts].host;
    }

    getHostname() {
        return this[urlParts].hostname;
    }

    getPort() {
        return this[urlParts].port;
    }

    getPathname() {
        return this[urlParts].pathname;
    }

    getQueryString() {
        return this[urlParts].query;
    }

    getQuery() {
        if (this[query]) {
            return this[query];
        }

        var queryString = this.getQueryString();
        var queryObject = (0, _querystring.parse)(queryString);

        this[query] = queryObject;

        return queryObject;
    }

    getHash() {
        return this[urlParts].hash;
    }

    getHeader(name) {
        name = name.toLowerCase();
        return this.getServerRequest().headers[name];
    }

    getParameter(name) {
        return this[parameters][name];
    }

    setParameter(name, value) {
        this[parameters][name] = value;
    }

    *getRawBody(options) {
        if (this[rawBody] !== null) {
            return this[rawBody];
        }

        var serverRequest = this.getServerRequest();
        var result = yield (0, _rawBody2.default)(serverRequest, options);

        this[rawBody] = result;
        return result;
    }

    *getFields() {
        if (this[fields] !== null) {
            return this[fields];
        }

        var data = yield this.getFieldsAndFiles();
        return data.fields;
    }

    *getFiles() {
        if (this[files] !== null) {
            return this[files];
        }

        var data = yield this.getFieldsAndFiles();
        return data.files;
    }

    *getFieldsAndFiles() {
        var _this = this;

        if (this[fields] !== null && this[files] !== null) {
            return {
                fields: this[fields],
                files: this[files]
            };
        }

        return new Promise(function (resolve, reject) {
            var form = _formidable2.default.IncomingForm();
            form.parse(self.serverRequest, function (error, parsedFields, parsedFiles) {
                if (error) {
                    reject(error);
                    return;
                }

                _this[fields] = parsedFields;

                _this[files] = parsedFiles;
                resolve({
                    fields: parsedFields,
                    files: parsedFiles
                });
            });
        });
    }

    getFirstAcceptedCharset() {
        for (var _len = arguments.length, charsets = Array(_len), _key = 0; _key < _len; _key++) {
            charsets[_key] = arguments[_key];
        }

        return this[accept].charset(charsets);
    }

    getCharsets() {
        return this[accept].charsets();
    }

    getFirstAcceptedEncoding() {
        for (var _len2 = arguments.length, encodings = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            encodings[_key2] = arguments[_key2];
        }

        return this[accept].encoding(encodings);
    }

    getEncodings() {
        return this[accept].encodings();
    }

    getFirstAcceptedLanguage() {
        for (var _len3 = arguments.length, languages = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
            languages[_key3] = arguments[_key3];
        }

        return this[accept].language(languages);
    }

    getLanguages() {
        return this[accept].languages();
    }

    getFirstAcceptedType() {
        for (var _len4 = arguments.length, types = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
            types[_key4] = arguments[_key4];
        }

        return this[accept].type(types);
    }

    getTypes() {
        return this[accept].types();
    }
};
exports.default = Request;
module.exports = exports["default"];