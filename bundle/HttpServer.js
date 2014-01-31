var solfege = require('solfegejs');
var http = require('http');
var co = require('co');
var defaultMiddleware = require('./middleware/default');

/**
 * A simple HTTP server
 */
var HttpServer = solfege.util.Class.create(function()
{
    // Set the default configuration
    this.configuration = require('../configuration/default.js');

    // By default, the server is not started
    this.isStarted = false;

}, 'solfege.bundle.server.HttpServer');
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
        var context = self.createContext(request, response);
        listener.call(context);
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
    var self = this;

    // Build the middleware list
    // Include a default middleware in order to always display something
    var middlewares = [defaultMiddleware].concat(this.configuration.middlewares);

    // Build the top decorator
    return function*(next)
    {
        // Start to the end of the list
        // The previous middleware is the argument of the current one, etc.
        var index = middlewares.length;
        var previousMiddleware = next || emptyMiddleware();

        while (index--) {
            var currentMiddleware = middlewares[index];
            previousMiddleware = currentMiddleware.call(this, previousMiddleware);
        }

        yield *previousMiddleware;
    };
};

/**
 * Create a context based on the request and the response
 *
 * @param   {Object}    request     The nodejs request
 * @param   {Object}    response    The nodejs response
 */
proto.createContext = function(request, response)
{
    var context = {};

    context.request = request;
    context.response = response;

    return context;
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
