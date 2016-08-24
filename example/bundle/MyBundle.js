"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _Application = require("solfegejs/lib/kernel/Application");

var _Application2 = _interopRequireDefault(_Application);

var _GeneratorUtil = require("solfegejs/lib/utils/GeneratorUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _ref(request, response) {
    console.log("ok");
}

class MyBundle {
    constructor() {
        this.application;
        this.container;
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath() {
        return __dirname;
    }

    /**
     * Initialize the bundle
     *
     * @param   {solfegejs/kernel/Application}  application     Solfege application
     */
    *initialize(application) {
        this.application = application;

        // Listen the application start
        this.application.on(_Application2.default.EVENT_START, (0, _GeneratorUtil.bindGenerator)(this, this.onStart));
    }

    *configureContainer(container) {
        this.container = container;
    }

    *onStart() {
        var serverFactory = yield this.container.get("http_server_factory");
        var server = serverFactory.create();
        server.start(8080, _ref);
    }
}
exports.default = MyBundle;
module.exports = exports['default'];