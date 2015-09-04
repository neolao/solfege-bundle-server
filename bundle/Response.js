"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

/**
 * A response
 */

var Response = (function () {
    /**
     * Constructor
     *
     * @param   {Object}    serverResponse      The original response
     */

    function Response(serverResponse) {
        _classCallCheck(this, Response);

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

    _createClass(Response, [{
        key: "statusCode",
        get: function get() {
            return this.serverResponse.statusCode;
        },
        set: function set(value) {
            this.serverResponse.statusCode = value;
        }

        /**
         * The status string
         *
         * @type {String}
         * @api public
         */
    }, {
        key: "statusString",
        get: function get() {
            return _http2["default"].STATUS_CODES[this.statusCode];
        }

        /**
         * Indicates that the headers are sent
         *
         * @type {Boolean}
         * @api public
         */
    }, {
        key: "headerSent",
        get: function get() {
            return this.serverResponse.headersSent;
        }

        /**
         * The response body
         *
         * @type {any}
         * @api public
         */
    }, {
        key: "body",
        get: function get() {
            return this._body;
        },
        set: function set(value) {
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
    }, {
        key: "length",
        get: function get() {
            var length = this.serverResponse._headers['content-length'];

            return ~ ~length;
        },
        set: function set(value) {
            this.setHeader('Content-Length', value);
        }
    }]);

    return Response;
})();

exports["default"] = Response;
module.exports = exports["default"];