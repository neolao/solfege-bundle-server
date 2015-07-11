"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

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

    // Initialize the parameters
    this.parameters = {};
  }

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
  }, {
    key: "getParameter",

    /**
     * Get a parameter value
     *
     * @param   {String}    name    The parameter name
     * @return  {any}               The parameter value
     */
    value: function getParameter(name) {
      return this.parameters[name];
    }
  }, {
    key: "setParameter",

    /**
     * Set a parameter value
     *
     * @param   {String}    name    The parameter name
     * @param   {any}               The parameter value
     */
    value: function setParameter(name, value) {
      this.parameters[name] = value;
    }
  }, {
    key: "method",

    /**
     * The method of the request
     *
     * @type {String}
     * @api public
     */
    get: function get() {
      return this.serverRequest.method;
    }
  }]);

  return Request;
})();

exports["default"] = Request;
module.exports = exports["default"];