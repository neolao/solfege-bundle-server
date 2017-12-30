"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _AbstractCommand = require("solfegejs-cli/lib/Command/AbstractCommand");

var _AbstractCommand2 = _interopRequireDefault(_AbstractCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _ref() {
  console.log("hit");
}

var StartCommand = class StartCommand extends _AbstractCommand2.default {
  constructor(serverFactory) {
    super();

    this.serverFactory = serverFactory;
  }

  async configure() {
    this.setName("example:start");
    this.setDescription("Start example");
  }

  async execute() {
    var defaultServer = this.serverFactory.create("default", 8080, _ref);
    defaultServer.start();

    console.info("Example started");
  }
};
exports.default = StartCommand;