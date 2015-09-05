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