"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _HttpServer = require("./HttpServer");

var _HttpServer2 = _interopRequireDefault(_HttpServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
        this.servers = {};

        this.middlewares = {};
    }

    create() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

        var server = new _HttpServer2.default(name);
        var middlewares = [];
        if (Array.isArray(this.middlewares[name])) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.middlewares[name][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var middleware = _step.value;

                    middlewares.push(middleware.instance);
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

            server.addMiddlewares(middlewares);
        }

        this.servers[name] = server;

        return server;
    }

    getServerNames() {
        var names = [];

        for (var name in this.servers) {
            if (names.indexOf(name) === -1) {
                names.push(name);
            }
        }

        for (var _name in this.middlewares) {
            if (names.indexOf(_name) === -1) {
                names.push(_name);
            }
        }

        return names;
    }

    getServer() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

        return this.servers[name];
    }

    addMiddleware(serverName, middleware, priority) {
        if (!Array.isArray(this.middlewares[serverName])) {
            this.middlewares[serverName] = [];
        }

        this.middlewares[serverName].push({
            instance: middleware,
            priority: priority
        });

        this.middlewares[serverName].sort(_ref);
    }

    getMiddlewares(serverName) {
        if (!Array.isArray(this.middlewares[serverName])) {
            this.middlewares[serverName] = [];
        }

        return this.middlewares[serverName].slice(0);
    }
};
exports.default = ServerFactory;
module.exports = exports["default"];