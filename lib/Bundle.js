"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _MiddlewareCompilerPass = require("./DependencyInjection/Compiler/MiddlewareCompilerPass");

var _MiddlewareCompilerPass2 = _interopRequireDefault(_MiddlewareCompilerPass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Server bundle
 */
class Bundle {
  /**
   * Constructor
   */
  constructor() {}

  /**
   * Get bundle path
   *
   * @return  {String}        The bundle path
   */
  getPath() {
    return __dirname;
  }

  /**
   * Configure service container
   *
   * @param   {Container}     container   Service container
   */
  *configureContainer(container) {
    container.addCompilerPass(new _MiddlewareCompilerPass2.default());
  }
}
exports.default = Bundle;
module.exports = exports['default'];