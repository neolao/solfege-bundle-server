var solfege = require('solfegejs');
var Request = require('./Request');
var Response = require('./Response');
var http = require('http');
var co = require('co');

/**
 * A simple HTTP server
 */
var HttpServer = solfege.util.Class.create(function()
{
    // Call parent constructor
    solfege.kernel.EventEmitter.call(this);

    // Set the default configuration
    this.configuration = require('../configuration/default.js');

    // By default, the server is not started
    this.isStarted = false;

}, 'solfege.bundle.server.HttpServer', solfege.kernel.EventEmitter);
var proto = HttpServer.prototype;

/**
 * The application instance
 *
 * @type {solfege.kernel.Application}
 * @api private
 */
proto.application;

/**
 * The configuration
 *
 * @type {Object}
 * @api private
 */
proto.configuration;

/**
 * Indicates that the server is started
 *
 * @type {Boolean}
 * @api private
 */
proto.isStarted;

/**
 * Set the application
 *
 * @param   {solfege.kernel.Application}    application     Application instance
 */
proto.setApplication = function*(application)
{
    this.application = application;

    // Set listeners
    var bindGenerator = solfege.util.Function.bindGenerator;
    this.application.on(solfege.kernel.Application.EVENT_END, bindGenerator(this, this.onApplicationEnd));
};

/**
 * Get the configuration
 *
 * @return  {Object}    The configuration
 */
proto.getConfiguration = function()
{
    return this.configuration;
};

/**
 * Override the current configuration
 *
 * @param   {Object}    customConfiguration     The custom configuration
 */
proto.overrideConfiguration = function*(customConfiguration)
{
    this.configuration = solfege.util.Object.merge(this.configuration, customConfiguration);
};

/**
 * Start the daemon
 *
 * @api public
 */
proto.startDaemon = function*()
{
    // If the "__daemon" environment variable is set, then it is a child process
    if (process.env.__daemon) {
        // Start the server
        yield this.start();
        return;
    }

    // Indicates that the next execution of this function is a daemon
    process.env.__daemon = 1;

    // Variables
    var spawn = require('child_process').spawn;
    var fs = require('fs');
    var nodePath = this.application.nodePath;
    var nodeArguments = this.application.nodeArguments;
    var scriptPath = this.application.scriptPath;
    var scriptArguments = this.application.scriptArguments;

    // Spawn the same command line
    var args = [].concat(this.application.commandLine);
    args.shift();
    var child = spawn(nodePath, args, {
        stdio: ['ignore', 'ignore', 'ignore'],
        detached: true
    });
    child.unref();

    // Create the pid file
    var pid = child.pid;
    var pidPath = 'server.pid';
    try {
        fs.statSync(pidPath);
        console.error('The daemon is already started. Check the pid file: ' + pidPath);
        child.kill();
        return;
    } catch (error) {
    }
    try {
        fs.writeFileSync(pidPath, pid);
    } catch (error) {
        console.error('Unable to write the file ' + pidPath);
        child.kill();
        return;
    }

    console.log('Daemon started (PID: ' + pid + ')');
};

/**
 * Check the daemon
 *
 * @api public
 */
proto.checkDaemon = function*()
{
    // Check the pid file
};

/**
 * Start the server
 *
 * @api public
 */
proto.start = function*()
{
    var self = this;
    var port = this.configuration.port;

    // Build the main listener
    var decorator = this.createMiddlewareDecorator();
    var listener = co(decorator);

    // Create the server
    var server = http.createServer(function(request, response)
    {
        var customRequest = new Request(request);
        var customResponse = new Response(response);

        listener(customRequest, customResponse);
    });

    this.isStarted = true;
    console.log('SolfegeJS HTTP server started on port ' + port);
    server.listen.apply(server, [port]);
};

/**
 * Create the middleware decorator with the middleware list
 *
 * @return  {GeneratorFunction}     The middleware decorator
 */
proto.createMiddlewareDecorator = function()
{
    var emptyMiddleware = function*(){};
    var bindGenerator = solfege.util.Function.bindGenerator;
    var self = this;

    // Build the middleware list from the configuration
    // Include main middleware in order to handle the final response
    // Each middleware execution are scoped to their container (bundle)
    var middlewares = [bindGenerator(this, this.mainMiddleware)];
    var total = this.configuration.middlewares.length;
    for (var index = 0; index < total; ++index) {
        var bundleId = this.configuration.middlewares[index];
        var bundle = this.application.getBundle(bundleId);

        if (bundle && 'function' === typeof bundle.middleware && 'GeneratorFunction' === bundle.middleware.constructor.name) {
            middlewares = middlewares.concat(bindGenerator(bundle, bundle.middleware));
        }
    }

    // Build the top decorator
    return function*(request, response, next)
    {
        // Start to the end of the list
        // The previous middleware is the argument of the current one, etc.
        var index = middlewares.length;
        var previousMiddleware = next || emptyMiddleware();

        while (index--) {
            var currentMiddleware = middlewares[index];
            previousMiddleware = currentMiddleware(request, response, previousMiddleware);
        }

        yield *previousMiddleware;
    };
};

/**
 * The main middleware
 *
 * @param   {solfege.bundle.server.Request}     request     The request
 * @param   {solfege.bundle.server.Response}    response    The response
 * @param   {GeneratorFunction}                 next        The next function
 */
proto.mainMiddleware = function*(request, response, next)
{
    // Handle the next middleware
    yield *next;

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
    if ('HEAD' === request.method) {
        noContent = true;
    }

    // No content
    if (noContent) {

        // Close the stream if necessary
        if (body && 'function' === typeof body.pipe) {
            body.close();
        }

        return serverResponse.end();
    }

    // No body
    if (null === body) {
        body = response.statusString;
    }

    // String body
    if ('string' === typeof body) {
        return serverResponse.end(body);
    }

    // Buffer body
    if (Buffer.isBuffer(body)) {
        return serverResponse.end(body);
    }

    // Stream body
    if ('function' == typeof body.pipe) {
        return body.pipe(serverResponse);
    }
};

/**
 * Executed when the application ends
 */
proto.onApplicationEnd = function*()
{
    if (this.isStarted) {
        console.log('\nSolfegeJS HTTP server stopped');
    }
};

module.exports = HttpServer;
