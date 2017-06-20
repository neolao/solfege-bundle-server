"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _HttpServer = require("./HttpServer");

var _HttpServer2 = _interopRequireDefault(_HttpServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var servers = Symbol();
var middlewares = Symbol();

function _ref(a, b) {
    if (a.priority < b.priority) {
        return -1;
    }
    if (a.priority > b.priority) {
        return 1;
    }
    return 0;
}

var ServerFactory = class ServerFactory {
    constructor() {
        this[servers] = {};

        this[middlewares] = {};
    }

    create() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";
        var port = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8080;
        var listener = arguments[2];

        var middlewaresByServer = this[middlewares];

        var server = new _HttpServer2.default(name, port, listener);
        var middlewareInstances = [];
        if (middlewaresByServer.hasOwnProperty(name) && Array.isArray(middlewaresByServer[name])) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = middlewaresByServer[name][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var middleware = _step.value;

                    middlewareInstances.push(middleware.instance);
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            server.addMiddlewares(middlewareInstances);
        }

        var serverInstances = this[servers];
        serverInstances[name] = server;

        return server;
    }

    getServerNames() {
        var names = [];

        var serverInstances = this[servers];
        for (var name in serverInstances) {
            if (names.indexOf(name) === -1) {
                names.push(name);
            }
        }

        var middlewaresByServer = this[middlewares];
        for (var _name in middlewaresByServer) {
            if (names.indexOf(_name) === -1) {
                names.push(_name);
            }
        }

        return names;
    }

    getServer() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

        var serverInstances = this[servers];

        if (!serverInstances.hasOwnProperty(name)) {
            throw new Error("HTTP server not found: " + name);
        }

        return serverInstances[name];
    }

    addMiddleware(serverName, middleware, priority) {
        var middlewaresByServer = this[middlewares];

        if (!middlewaresByServer.hasOwnProperty(serverName)) {
            middlewaresByServer[serverName] = [];
        }

        middlewaresByServer[serverName].push({
            instance: middleware,
            priority: priority
        });

        middlewaresByServer[serverName].sort(_ref);
    }

    getMiddlewares(serverName) {
        var middlewaresByServer = this[middlewares];

        if (!middlewaresByServer.hasOwnProperty(serverName)) {
            middlewaresByServer[serverName] = [];
        }

        var serverMiddlewares = middlewaresByServer[serverName];
        return serverMiddlewares.slice(0);
    }
};
exports.default = ServerFactory;
module.exports = exports["default"];