"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _HttpServer = require("./HttpServer");

var _HttpServer2 = _interopRequireDefault(_HttpServer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _ref2(_id2) {
    if (!(_id2 instanceof _HttpServer2.default)) {
        throw new TypeError("Function return value violates contract.\n\nExpected:\nHttpServer\n\nGot:\n" + _inspect(_id2));
    }

    return _id2;
}

function _ref4(a, b) {
    if (a.priority < b.priority) {
        return -1;
    }
    if (a.priority > b.priority) {
        return 1;
    }
    return 0;
}

class ServerFactory {
    constructor() {
        this.servers = {};

        this.middlewares = {};
    }

    create() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        var server = new _HttpServer2.default(name);
        var middlewares = [];
        if (Array.isArray(this.middlewares[name])) {
            _middlewares$name = this.middlewares[name];

            if (!(_middlewares$name && (typeof _middlewares$name[Symbol.iterator] === 'function' || Array.isArray(_middlewares$name)))) {
                throw new TypeError("Expected _middlewares$name to be iterable, got " + _inspect(_middlewares$name));
            }

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = _middlewares$name[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _middlewares$name;

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

    getServers() {
        return Object.assign({}, this.servers);
    }

    getServer() {
        var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "default";

        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        return _ref2(this.servers[name]);
    }

    addMiddleware(serverName, middleware, priority) {
        if (!(typeof serverName === 'string')) {
            throw new TypeError("Value of argument \"serverName\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(serverName));
        }

        if (!(typeof priority === 'number' && !isNaN(priority) && priority >= 0 && priority <= 4294967295 && priority === Math.floor(priority))) {
            throw new TypeError("Value of argument \"priority\" violates contract.\n\nExpected:\nuint32\n\nGot:\n" + _inspect(priority));
        }

        if (!Array.isArray(this.middlewares[serverName])) {
            this.middlewares[serverName] = [];
        }

        this.middlewares[serverName].push({
            instance: middleware,
            priority: priority
        });

        this.middlewares[serverName].sort(_ref4);
    }

    getMiddlewares(serverName) {
        if (!(typeof serverName === 'string')) {
            throw new TypeError("Value of argument \"serverName\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(serverName));
        }

        if (!Array.isArray(this.middlewares[serverName])) {
            this.middlewares[serverName] = [];
        }

        return this.middlewares[serverName].slice(0);
    }
}
exports.default = ServerFactory;

function _inspect(input) {
    function _ref6(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref5(item) {
        return _inspect(item) === first;
    }

    if (input === null) {
        return 'null';
    } else if (input === undefined) {
        return 'void';
    } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
        return typeof input === "undefined" ? "undefined" : _typeof(input);
    } else if (Array.isArray(input)) {
        if (input.length > 0) {
            var first = _inspect(input[0]);

            if (input.every(_ref5)) {
                return first.trim() + '[]';
            } else {
                return '[' + input.map(_inspect).join(', ') + ']';
            }
        } else {
            return 'Array';
        }
    } else {
        var keys = Object.keys(input);

        if (!keys.length) {
            if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
                return input.constructor.name;
            } else {
                return 'Object';
            }
        }

        var entries = keys.map(_ref6).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}

module.exports = exports['default'];