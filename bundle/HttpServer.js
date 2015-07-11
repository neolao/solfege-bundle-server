"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _solfegejs = require("solfegejs");

var _solfegejs2 = _interopRequireDefault(_solfegejs);

var _Request = require("./Request");

var _Request2 = _interopRequireDefault(_Request);

var _Response = require("./Response");

var _Response2 = _interopRequireDefault(_Response);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _co = require("co");

var _co2 = _interopRequireDefault(_co);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _child_process = require("child_process");

var Application = _solfegejs2["default"].kernel.Application;

/**
 * A simple HTTP server
 *
 * @class   solfege.bundle.server.HttpServer
 */

var HttpServer = (function (_solfege$kernel$EventEmitter) {
    /**
     * Constructor
     */

    function HttpServer() {
        _classCallCheck(this, HttpServer);

        _get(Object.getPrototypeOf(HttpServer.prototype), "constructor", this).call(this);

        // Set the default configuration
        this.configuration = require("../configuration/default.js");

        // By default, the server is not started
        this.isStarted = false;
    }

    _inherits(HttpServer, _solfege$kernel$EventEmitter);

    _createClass(HttpServer, [{
        key: "setApplication",

        /**
         * Set the application
         *
         * @param   {solfege.kernel.Application}    application     Application instance
         */
        value: function* setApplication(application) {
            this.application = application;

            // Set listeners
            var bindGenerator = _solfegejs2["default"].util.Function.bindGenerator;
            this.application.on(_solfegejs2["default"].kernel.Application.EVENT_END, bindGenerator(this, this.onApplicationEnd));
        }
    }, {
        key: "getConfiguration",

        /**
         * Get the configuration
         *
         * @return  {Object}    The configuration
         */
        value: function getConfiguration() {
            return this.configuration;
        }
    }, {
        key: "overrideConfiguration",

        /**
         * Override the current configuration
         *
         * @param   {Object}    customConfiguration     The custom configuration
         */
        value: function* overrideConfiguration(customConfiguration) {
            this.configuration = _extends(this.configuration, customConfiguration);
        }
    }, {
        key: "startDaemon",

        /**
         * Start the daemon
         *
         * @api public
         */
        value: function* startDaemon() {
            // If the "__daemon" environment variable is set, then it is a child process
            if (process.env.__daemon) {
                // Start the server
                yield this.start();
                return true;
            }

            // Indicates that the next execution of this function is a daemon
            process.env.__daemon = true;

            // Variables
            var configuration = this.configuration;
            var nodePath = this.application.nodePath;

            // Log file
            var output = "ignore";
            try {
                if (configuration.daemon.logPath) {
                    output = _fs2["default"].openSync(configuration.daemon.logPath, "a");
                }
            } catch (error) {
                output = "ignore";
            }

            // Spawn the same command line
            var args = [].concat(this.application.commandLine);
            args.shift();
            var child = (0, _child_process.spawn)(nodePath, args, {
                stdio: ["ignore", output, output]
            });

            // Create the pid file
            var pid = child.pid;
            var pidPath = configuration.daemon.pidPath;
            try {
                pid = _fs2["default"].readFileSync(pidPath);
                console.error("The daemon is already started (PID: " + pid + ")");
                child.kill();
                return false;
            } catch (error) {}
            try {
                _fs2["default"].writeFileSync(pidPath, pid);
            } catch (error) {
                console.error("Unable to write the file " + pidPath);
                child.kill();
                return false;
            }

            console.log("Daemon started (PID: " + pid + ")");
            child.unref();
            return true;
        }
    }, {
        key: "stopDaemon",

        /**
         * Stop the daemon
         *
         * @api public
         */
        value: function* stopDaemon() {
            var pidPath = this.configuration.daemon.pidPath;

            // Get the pid
            try {
                var _pid = _fs2["default"].readFileSync(pidPath);
            } catch (error) {
                console.error("Unable to read the file " + pidPath);
                return false;
            }

            // Delete the pid file
            try {
                _fs2["default"].unlinkSync(pidPath);
            } catch (error) {
                console.error("Unable to delete the file " + pidPath);
                return false;
            }

            // Kill the daemon
            try {
                process.kill(pid);
            } catch (error) {
                console.error("Unable to kill the process " + pid);
                return false;
            }

            console.log("Daemon stopped");
            return true;
        }
    }, {
        key: "restartDaemon",

        /**
         * Restart the daemon
         *
         * @api public
         */
        value: function* restartDaemon() {
            // If the "__daemon" environment variable is set, then it is a child process
            if (process.env.__daemon) {
                // Start the server
                yield this.start();
                return true;
            }

            var stopped = yield this.stopDaemon();
            if (stopped) {
                yield this.startDaemon();
                return true;
            }

            return false;
        }
    }, {
        key: "checkDaemon",

        /**
         * Check the daemon
         *
         * @api public
         */
        value: function* checkDaemon() {
            var pidPath = this.configuration.daemon.pidPath;

            // Get the pid
            try {
                var _pid2 = _fs2["default"].readFileSync(pidPath);
            } catch (error) {
                console.log("The daemon is not running");
                return false;
            }

            console.log("The daemon is running");
        }
    }, {
        key: "start",

        /**
         * Start the server
         *
         * @api public
         */
        value: function* start() {
            var self = this;
            var port = this.configuration.port;

            // Build the main listener
            var decorator = this.createMiddlewareDecorator();
            var listener = (0, _co2["default"])(decorator);

            // Create the server
            var server = _http2["default"].createServer(function (request, response) {
                var customRequest = new _Request2["default"](request);
                var customResponse = new _Response2["default"](response);

                listener(customRequest, customResponse);
            });

            this.isStarted = true;
            console.log("SolfegeJS HTTP server started on port " + port);
            server.listen.apply(server, [port]);
        }
    }, {
        key: "createMiddlewareDecorator",

        /**
         * Create the middleware decorator with the middleware list
         *
         * @return  {GeneratorFunction}     The middleware decorator
         */
        value: function createMiddlewareDecorator() {
            var self = this;
            var emptyMiddleware = function* emptyMiddleware() {};
            var bindGenerator = _solfegejs2["default"].util.Function.bindGenerator;

            // Build the middleware list from the configuration
            // Include main middleware in order to handle the final response
            // Each middleware execution are scoped to their container (bundle)
            var middlewares = [bindGenerator(this, this.mainMiddleware)];
            var total = this.configuration.middlewares.length;
            for (var index = 0; index < total; ++index) {
                var middleware = this.configuration.middlewares[index];

                // If the middleware is a function, then include it without the scope
                if ("function" === typeof middleware) {
                    if ("GeneratorFunction" === middleware.constructor.name) {
                        middlewares.push(middleware);
                    } else {
                        console.error("The middleware " + index + " must be a generator");
                    }
                    continue;
                }

                // If the middleware is a string, then parse it as a Solfege URI
                if ("string" === typeof middleware) {
                    var solfegeUri = middleware;
                    var bundle = this.application.getBundleFromSolfegeUri(solfegeUri, this);
                    middleware = this.application.resolveSolfegeUri(solfegeUri, this);

                    if (bundle && "function" === typeof middleware && "GeneratorFunction" === middleware.constructor.name) {
                        middlewares.push(bindGenerator(bundle, middleware));
                    }
                }
            }

            // Build the top decorator
            return function* (request, response, next) {
                // Start to the end of the list
                // The previous middleware is the argument of the current one, etc.
                var index = middlewares.length;
                var previousMiddleware = next || emptyMiddleware();

                while (index--) {
                    var currentMiddleware = middlewares[index];
                    previousMiddleware = currentMiddleware(request, response, previousMiddleware);
                }

                yield* previousMiddleware;
            };
        }
    }, {
        key: "mainMiddleware",

        /**
         * The main middleware
         *
         * @param   {solfege.bundle.server.Request}     request     The request
         * @param   {solfege.bundle.server.Response}    response    The response
         * @param   {GeneratorFunction}                 next        The next function
         */
        value: function* mainMiddleware(request, response, next) {
            // Handle the next middleware
            yield* next;

            // Variables
            var body = response.body;
            var statusCode = response.statusCode;
            var serverResponse = response.serverResponse;

            // If the headers are sent, then do nothing
            if (response.headersSent) {
                return;
            }

            // Check the status for empty content
            var noContent = ~[204, 205, 304].indexOf(statusCode);

            // Check if the request method is "HEAD"
            // Note: The HEAD method is identical to GET except that the server MUST NOT return a message-body in the response.
            if ("HEAD" === request.method) {
                noContent = true;
            }

            // No content
            if (noContent) {

                // Close the stream if necessary
                if (body && "function" === typeof body.pipe) {
                    body.close();
                }

                return serverResponse.end();
            }

            // No body
            if (null === body) {
                body = response.statusString;
            }

            // String body
            if ("string" === typeof body) {
                return serverResponse.end(body);
            }

            // Buffer body
            if (Buffer.isBuffer(body)) {
                return serverResponse.end(body);
            }

            // Stream body
            if (body instanceof _stream2["default"]) {
                return body.pipe(serverResponse);
            }
        }
    }, {
        key: "onApplicationEnd",

        /**
         * Executed when the application ends
         */
        value: function* onApplicationEnd() {
            if (this.isStarted) {
                console.log("\nSolfegeJS HTTP server stopped");
            }
        }
    }]);

    return HttpServer;
})(_solfegejs2["default"].kernel.EventEmitter);

exports["default"] = HttpServer;
module.exports = exports["default"];