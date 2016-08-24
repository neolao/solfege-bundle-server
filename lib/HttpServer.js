"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _Request = require("./Request");

var _Request2 = _interopRequireDefault(_Request);

var _Response = require("./Response");

var _Response2 = _interopRequireDefault(_Response);

var _GeneratorUtil = require("solfegejs/lib/utils/GeneratorUtil");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A simple HTTP server
 */

function _ref(_id) {
    if (!(typeof _id === 'string')) {
        throw new TypeError("Function return value violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(_id));
    }

    return _id;
}

function* _ref3() {}

class HttpServer {
    /**
     * Constructor
     *
     * @param   {string}    name    Server name
     */
    constructor(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        this.name = name;
        this.middlewares = [];
    }

    /**
     * Get server name
     *
     * @return  {string}    Server name
     */
    getName() {
        return _ref(this.name);
    }

    /**
     * Set server name
     *
     * @param   {string}    name    Server name
     */
    setName(name) {
        if (!(typeof name === 'string')) {
            throw new TypeError("Value of argument \"name\" violates contract.\n\nExpected:\nstring\n\nGot:\n" + _inspect(name));
        }

        this.name = name;
    }

    /**
     * Add middlewares
     *
     * @param   {Array}     middlewares     Middlewares
     */
    addMiddlewares(middlewares) {
        if (!Array.isArray(middlewares)) {
            throw new TypeError("Value of argument \"middlewares\" violates contract.\n\nExpected:\nArray\n\nGot:\n" + _inspect(middlewares));
        }

        this.middlewares = middlewares;
    }

    /**
     * Start the server
     *
     * @param   {uint32}    port        Server port
     * @param   {function}  listener    Server listener
     */
    start(port, listener) {
        if (!(typeof port === 'number' && !isNaN(port) && port >= 0 && port <= 4294967295 && port === Math.floor(port))) {
            throw new TypeError("Value of argument \"port\" violates contract.\n\nExpected:\nuint32\n\nGot:\n" + _inspect(port));
        }

        // Build middlewares defined in services
        var middlewareDecorator = this.buildMiddlewareDecorator(listener);

        // Create the server
        var server = _http2.default.createServer(function (request, response) {
            var customRequest = new _Request2.default(request);
            var customResponse = new _Response2.default(response);

            middlewareDecorator(customRequest, customResponse);
        });

        server.listen(port);
        console.log("Server started on port " + port);
    }

    /**
     * Build middleware decorator
     *
     * @param   {function}  lastMiddleware  The last middleware
     * @return  {function}                  The decodator
     */
    buildMiddlewareDecorator(lastMiddleware) {
        var self = this;
        var emptyMiddlewareHandler = _ref3;

        // Add the last middle
        var middlewares = this.middlewares.slice(0);
        middlewares.splice(1, 0, {
            handle: function* handle(request, response, next) {
                lastMiddleware(request, response);

                yield* next;
            }
        });

        // Build the top decorator
        return _co2.default.wrap(function* (request, response, next) {
            // Start to the end of the list
            // The previous middleware is the argument of the current one, etc.
            var index = middlewares.length;
            var previousMiddlewareHandler = next || emptyMiddlewareHandler();

            while (index--) {
                var instance = middlewares[index];
                var handler = instance.handle;
                if (!(0, _GeneratorUtil.isGenerator)(handler)) {
                    throw new Error("Middleware " + instance + " must have generator method handle()");
                }

                var currentMiddlewareHandler = (0, _GeneratorUtil.bindGenerator)(instance, handler);
                previousMiddlewareHandler = currentMiddlewareHandler(request, response, previousMiddlewareHandler);
            }

            yield* previousMiddlewareHandler;
        });
    }
}
exports.default = HttpServer;

function _inspect(input) {
    function _ref5(key) {
        return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key]) + ';';
    }

    function _ref4(item) {
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

            if (input.every(_ref4)) {
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

        var entries = keys.map(_ref5).join('\n  ');

        if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
            return input.constructor.name + ' {\n  ' + entries + '\n}';
        } else {
            return '{ ' + entries + '\n}';
        }
    }
}

module.exports = exports['default'];