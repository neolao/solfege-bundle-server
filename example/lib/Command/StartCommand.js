"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _ContainerAwareCommand = require("solfegejs-cli/lib/Command/ContainerAwareCommand");

var _ContainerAwareCommand2 = _interopRequireDefault(_ContainerAwareCommand);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var StartCommand = class StartCommand extends _ContainerAwareCommand2.default {
    *configure() {
        this.setName("example:start");
        this.setDescription("Start example");
    }

    *execute() {
        var container = this.getContainer();
        var serverFactory = yield container.get("http_server_factory");

        var defaultServer = serverFactory.create("default", 8083);
        var secondaryServer = serverFactory.create("secondary", 8081);
        defaultServer.start();
        secondaryServer.start();

        console.info("Example started");
    }
};
exports.default = StartCommand;
module.exports = exports["default"];