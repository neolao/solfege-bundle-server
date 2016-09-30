"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _MiddlewareCompilerPass = require("./DependencyInjection/Compiler/MiddlewareCompilerPass");

var _MiddlewareCompilerPass2 = _interopRequireDefault(_MiddlewareCompilerPass);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Bundle {
  constructor() {}

  getPath() {
    return __dirname;
  }

  *configureContainer(container) {
    container.addCompilerPass(new _MiddlewareCompilerPass2.default());
  }
}
exports.default = Bundle;
module.exports = exports['default'];