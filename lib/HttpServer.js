"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _bindGenerator = require("bind-generator");

var _bindGenerator2 = _interopRequireDefault(_bindGenerator);

var _isGenerator = require("is-generator");

var _Request = require("./Request");

var _Request2 = _interopRequireDefault(_Request);

var _Response = require("./Response");

var _Response2 = _interopRequireDefault(_Response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function* _ref() {}

var HttpServer = class HttpServer {
    constructor(name) {
        this.name = name;
        this.middlewares = [];
    }

    getName() {
        return this.name;
    }

    setName(name) {
        this.name = name;
    }

    addMiddlewares(middlewares) {
        this.middlewares = middlewares;
    }

    start(port, listener) {
        var middlewareDecorator = this.buildMiddlewareDecorator(listener);

        var server = _http2.default.createServer(function (request, response) {
            var customRequest = new _Request2.default(request);
            var customResponse = new _Response2.default(response);

            middlewareDecorator(customRequest, customResponse);
        });

        server.listen(port);
    }

    buildMiddlewareDecorator(lastMiddleware) {
        var self = this;
        var emptyMiddlewareHandler = _ref;

        var middlewares = this.middlewares.slice(0);

        function* _handle(request, response, next) {
            lastMiddleware(request, response);

            if (next) {
                yield* next;
            }
        }

        if (typeof lastMiddleware === "function") {
            middlewares.splice(1, 0, {
                handle: _handle
            });
        }

        return _co2.default.wrap(function* (request, response, next) {
            var index = middlewares.length;
            var previousMiddlewareHandler = next || emptyMiddlewareHandler();

            while (index--) {
                var instance = middlewares[index];
                var handler = instance.handle;
                if (!(0, _isGenerator.fn)(handler)) {
                    throw new Error("Middleware " + String(instance) + " must have generator method handle()");
                }

                var currentMiddlewareHandler = (0, _bindGenerator2.default)(instance, handler);
                previousMiddlewareHandler = currentMiddlewareHandler(request, response, previousMiddlewareHandler);
            }

            yield* previousMiddlewareHandler;
        });
    }
};
exports.default = HttpServer;
module.exports = exports["default"];