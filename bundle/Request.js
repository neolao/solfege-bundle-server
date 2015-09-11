"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _url = require("url");

var _querystring = require("querystring");

var _rawBody = require("raw-body");

var _rawBody2 = _interopRequireDefault(_rawBody);

var _formidable = require("formidable");

var _formidable2 = _interopRequireDefault(_formidable);

var _accepts = require("accepts");

var _accepts2 = _interopRequireDefault(_accepts);

/**
 * A request
 */

var Request = (function () {
    /**
     * Constructor
     *
     * @param   {Object}    serverRequest       The original request
     */

    function Request(serverRequest) {
        _classCallCheck(this, Request);

        // Save the original request
        this.serverRequest = serverRequest;

        // Copy some informations
        this.url = serverRequest.url;

        // Parse the URL
        this.urlParts = (0, _url.parse)(this.url);
        this._query = null;

        // Initialize the parameters
        this.parameters = {};

        // The fields sent
        this.fields = null;

        // The files sent
        this.files = null;

        // The raw body
        this.rawBody = null;

        // The helper that parse the headers to get informations like charsets, encodings, etc.
        this.accept = (0, _accepts2["default"])(serverRequest);
    }

    /**
     * The method of the request
     *
     * @type {String}
     */

    _createClass(Request, [{
        key: "getHeader",

        /**
         * Get a header
         *
         * @param   {String}    name    The header name
         * @return  {String}            The header value
         */
        value: function getHeader(name) {
            name = name.toLowerCase();
            return this.serverRequest.headers[name];
        }

        /**
         * Get a parameter value
         *
         * @param   {String}    name    The parameter name
         * @return  {any}               The parameter value
         */
    }, {
        key: "getParameter",
        value: function getParameter(name) {
            return this.parameters[name];
        }

        /**
         * Set a parameter value
         *
         * @param   {String}    name    The parameter name
         * @param   {any}               The parameter value
         */
    }, {
        key: "setParameter",
        value: function setParameter(name, value) {
            this.parameters[name] = value;
        }

        /**
         * Get the raw body
         *
         * @param   {Object}    options     The options (see "raw-body" module)
         * @return  {String}                The raw body
         */
    }, {
        key: "getRawBody",
        value: function* getRawBody(options) {
            if (this.rawBody !== null) {
                return this.rawBody;
            }

            var rawBody = yield (0, _rawBody2["default"])(this.serverRequest, options);
            this.rawBody = rawBody;
            return rawBody;
        }

        /**
         * Get the fields
         *
         * @return  {Object}    The fields
         */
    }, {
        key: "getFields",
        value: function* getFields() {
            // Get the cached property
            if (this.fields !== null) {
                return this.fields;
            }

            var data = yield this.getFieldsAndFiles();
            return data.fields;
        }

        /**
         * Get the files
         *
         * @return  {Object}    The files
         */
    }, {
        key: "getFiles",
        value: function* getFiles() {
            // Get the cached property
            if (this.files !== null) {
                return this.files;
            }

            var data = yield this.getFieldsAndFiles();
            return data.files;
        }

        /**
         * Get the fields and files
         *
         * @return  {Object}    The object containing the fields and files
         */
    }, {
        key: "getFieldsAndFiles",
        value: function* getFieldsAndFiles() {
            // Get the cached properties
            if (this.fields !== null && this.fields !== null) {
                return {
                    fields: this.fields,
                    files: this.files
                };
            }

            // Extract the properties from the request
            var self = this;
            return new Promise(function (resolve, reject) {
                var form = _formidable2["default"].IncomingForm();
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

        /**
         * Return the first accepted charset.
         * If nothing in charsets is accepted, then false is returned.
         *
         * @param   {array}     charsets    Accepted charsets
         * @return  {string}                First accepted charset
         */
    }, {
        key: "acceptsCharsets",
        value: function acceptsCharsets() {
            for (var _len = arguments.length, charsets = Array(_len), _key = 0; _key < _len; _key++) {
                charsets[_key] = arguments[_key];
            }

            return this.accept.charset(charsets);
        }

        /**
         * Return the charsets that the request accepts, 
         * in the order of the client's preference (most preferred first).
         *
         * @return  {array}     The charsets
         */
    }, {
        key: "charsets",
        value: function charsets() {
            return this.accept.charsets();
        }

        /**
         * Return the first accepted encoding. 
         * If nothing in encodings is accepted, then false is returned.
         *
         * @param   {array}     encodings   Accepted encodings
         * @return  {string}                First accepted encoding
         */
    }, {
        key: "acceptsEncodings",
        value: function acceptsEncodings() {
            for (var _len2 = arguments.length, encodings = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                encodings[_key2] = arguments[_key2];
            }

            return this.accept.encoding(encodings);
        }

        /**
         * Return the encodings that the request accepts, 
         * in the order of the client's preference (most preferred first).
         *
         * @return  {array}     The encodings
         */
    }, {
        key: "encodings",
        value: function encodings() {
            return this.accept.encodings();
        }

        /**
         * Return the first accepted language. 
         * If nothing in languages is accepted, then false is returned.
         *
         * @param   {array}     languages   Accepted languages
         * @return  {string}                First accepted language
         */
    }, {
        key: "acceptsLanguages",
        value: function acceptsLanguages() {
            for (var _len3 = arguments.length, languages = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                languages[_key3] = arguments[_key3];
            }

            return this.accept.language(languages);
        }

        /**
         * Return the languages that the request accepts, 
         * in the order of the client's preference (most preferred first).
         *
         * @return  {array}     The languages
         */
    }, {
        key: "languages",
        value: function languages() {
            return this.accept.languages();
        }

        /**
         * Return the first accepted type 
         * (and it is returned as the same text as what appears in the types array). 
         * If nothing in types is accepted, then false is returned.
         *
         * @param   {array}     types   Accepted types
         * @return  {string}            First accepted type
         */
    }, {
        key: "acceptsTypes",
        value: function acceptsTypes() {
            for (var _len4 = arguments.length, types = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                types[_key4] = arguments[_key4];
            }

            return this.accept.type(types);
        }

        /**
         * Return the types that the request accepts, 
         * in the order of the client's preference (most preferred first).
         *
         * @return  {array}     The types
         */
    }, {
        key: "types",
        value: function types() {
            return this.accept.types();
        }
    }, {
        key: "method",
        get: function get() {
            return this.serverRequest.method;
        }

        /**
         * The protocol
         *
         * @type {String}
         */
    }, {
        key: "protocol",
        get: function get() {
            return this.urlParts.protocol;
        }

        /**
         * The host
         *
         * @type {String}
         */
    }, {
        key: "host",
        get: function get() {
            return this.urlParts.host;
        }

        /**
         * The hostname
         *
         * @type {String}
         */
    }, {
        key: "hostname",
        get: function get() {
            return this.urlParts.hostname;
        }

        /**
         * The port
         *
         * @type {Number}
         */
    }, {
        key: "port",
        get: function get() {
            return this.urlParts.port;
        }

        /**
         * The pathname
         *
         * @type {String}
         */
    }, {
        key: "pathname",

        /**
         * The query string including the leading question mark
         *
         * @type {String}
         */
        get: function get() {
            return this.urlParts.pathname;
        }

        /**
         * The query string
         *
         * @type {String}
         */
    }, {
        key: "queryString",
        get: function get() {
            return this.urlParts.query;
        }

        /**
         * The query
         *
         * @type {Object}
         */
    }, {
        key: "query",
        get: function get() {
            if (this._query) {
                return this._query;
            }

            this._query = (0, _querystring.parse)(this.queryString);

            return this._query;
        }

        /**
         * The hash
         *
         * @type {String}
         */
    }, {
        key: "hash",
        get: function get() {
            return this.urlParts.hash;
        }
    }]);

    return Request;
})();

exports["default"] = Request;
module.exports = exports["default"];