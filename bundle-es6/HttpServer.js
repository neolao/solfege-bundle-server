import solfege from "solfegejs";
import Request from "./Request";
import Response from "./Response";
import http from "http";
import Stream from "stream";
import co from "co";
import fs from "fs";
import {spawn} from "child_process";

/**
 * A simple HTTP server
 *
 * @class   solfege.bundle.server.HttpServer
 */
export default class HttpServer extends solfege.kernel.EventEmitter
{
    /**
     * Constructor
     */
    constructor()
    {
        super();

        // Set the default configuration
        this.configuration = require('../configuration/default.js');

        // By default, the server is not started
        this.isStarted = false;
    }

    /**
     * Set the application
     *
     * @param   {solfege.kernel.Application}    application     Application instance
     */
    *setApplication(application)
    {
        this.application = application;

        // Set listeners
        var bindGenerator = solfege.util.Function.bindGenerator;
        this.application.on(solfege.kernel.Application.EVENT_END, bindGenerator(this, this.onApplicationEnd));
    }

    /**
     * Get the configuration
     *
     * @return  {Object}    The configuration
     */
    getConfiguration()
    {
        return this.configuration;
    }

    /**
     * Override the current configuration
     *
     * @param   {Object}    customConfiguration     The custom configuration
     */
    *overrideConfiguration(customConfiguration:object)
    {
        this.configuration = Object.assign(this.configuration, customConfiguration);
    }

    /**
     * Start the daemon
     *
     * @api public
     */
    *startDaemon()
    {
        // If the "__daemon" environment variable is set, then it is a child process
        if (process.env.__daemon) {
            // Start the server
            yield this.start();
            return true;
        }

        // Indicates that the next execution of this function is a daemon
        process.env.__daemon = true;

        // Variables
        let configuration = this.configuration;
        let nodePath = this.application.nodePath;

        // Log file
        let output = 'ignore';
        try {
            if (configuration.daemon.logPath) {
                output = fs.openSync(configuration.daemon.logPath, 'a');
            }
        } catch (error) {
            output = 'ignore';
        }

        // Spawn the same command line
        let args = [].concat(this.application.commandLine);
        args.shift();
        let child = spawn(nodePath, args, {
            stdio: ['ignore', output, output]
        });

        // Create the pid file
        let pid = child.pid;
        let pidPath = configuration.daemon.pidPath;
        try {
            pid = fs.readFileSync(pidPath);
            console.error('The daemon is already started (PID: ' + pid + ')');
            child.kill();
            return false;
        } catch (error) {
        }
        try {
            fs.writeFileSync(pidPath, pid);
        } catch (error) {
            console.error('Unable to write the file ' + pidPath);
            child.kill();
            return false;
        }

        console.log('Daemon started (PID: ' + pid + ')');
        child.unref();
        return true;
    }

    /**
     * Stop the daemon
     *
     * @api public
     */
    *stopDaemon()
    {
        let pidPath = this.configuration.daemon.pidPath;

        // Get the pid
        try {
            let pid = fs.readFileSync(pidPath);
        } catch (error) {
            console.error('Unable to read the file ' + pidPath);
            return false;
        }

        // Delete the pid file
        try {
            fs.unlinkSync(pidPath);
        } catch (error) {
            console.error('Unable to delete the file ' + pidPath);
            return false;
        }

        // Kill the daemon
        try {
            process.kill(pid);
        } catch (error) {
            console.error('Unable to kill the process ' + pid);
            return false;
        }

        console.log('Daemon stopped');
        return true;
    }

    /**
     * Restart the daemon
     *
     * @api public
     */
    *restartDaemon()
    {
        // If the "__daemon" environment variable is set, then it is a child process
        if (process.env.__daemon) {
            // Start the server
            yield this.start();
            return true;
        }

        let stopped = yield this.stopDaemon();
        if (stopped) {
            yield this.startDaemon();
            return true;
        }

        return false;
    }

    /**
     * Check the daemon
     *
     * @api public
     */
    *checkDaemon()
    {
        let pidPath = this.configuration.daemon.pidPath;

        // Get the pid
        try {
            let pid = fs.readFileSync(pidPath);
        } catch (error) {
            console.log('The daemon is not running');
            return false;
        }

        console.log('The daemon is running');
    }

    /**
     * Start the server
     *
     * @api public
     */
    *start()
    {
        let self = this;
        let port = this.configuration.port;

        // Build the main listener
        let decorator = this.createMiddlewareDecorator();
        let listener = co.wrap(decorator);

        // Create the server
        let server = http.createServer(function(request, response)
        {
            let customRequest = new Request(request);
            let customResponse = new Response(response);

            listener(customRequest, customResponse);
        });

        this.isStarted = true;
        console.log('SolfegeJS HTTP server started on port ' + port);
        server.listen.apply(server, [port]);
    }

    /**
     * Create the middleware decorator with the middleware list
     *
     * @return  {GeneratorFunction}     The middleware decorator
     */
    createMiddlewareDecorator()
    {
        let self = this;
        let emptyMiddleware = function*(){};
        let bindGenerator = solfege.util.Function.bindGenerator;

        // Build the middleware list from the configuration
        // Include main middleware in order to handle the final response
        // Each middleware execution are scoped to their container (bundle)
        let middlewares = [bindGenerator(this, this.mainMiddleware)];
        let total = this.configuration.middlewares.length;
        for (let index = 0; index < total; ++index) {
            let middleware = this.configuration.middlewares[index];

            // If the middleware is a function, then include it without the scope
            if ('function' === typeof middleware) {
                if ('GeneratorFunction' === middleware.constructor.name) {
                    middlewares.push(middleware);
                } else {
                    console.error('The middleware ' + index + ' must be a generator');
                }
                continue;
            }

            // If the middleware is a string, then parse it as a Solfege URI
            if ('string' === typeof middleware) {
                let solfegeUri = middleware;
                let bundle = this.application.getBundleFromSolfegeUri(solfegeUri, this);
                middleware = this.application.resolveSolfegeUri(solfegeUri, this);

                if (bundle && 'function' === typeof middleware && 'GeneratorFunction' === middleware.constructor.name) {
                    middlewares.push(bindGenerator(bundle, middleware));
                }
            }

        }

        // Build the top decorator
        return function*(request, response, next)
        {
            // Start to the end of the list
            // The previous middleware is the argument of the current one, etc.
            let index = middlewares.length;
            let previousMiddleware = next || emptyMiddleware();

            while (index--) {
                let currentMiddleware = middlewares[index];
                previousMiddleware = currentMiddleware(request, response, previousMiddleware);
            }

            yield *previousMiddleware;
        };
    }

    /**
     * The main middleware
     *
     * @param   {solfege.bundle.server.Request}     request     The request
     * @param   {solfege.bundle.server.Response}    response    The response
     * @param   {GeneratorFunction}                 next        The next function
     */
    *mainMiddleware(request, response, next)
    {
        // Handle the next middleware
        let error;
        try {
            yield *next;
        } catch (middlewareError) {
            error = middlewareError;
        }

        // Variables
        let body = response.body;
        let statusCode = response.statusCode;
        let serverResponse = response.serverResponse;

        // If the headers are sent, then do nothing
        if (response.headersSent) {
            return;
        }

        // Handle the error
        if (error) {
            console.error(error.stack);
            serverResponse.statusCode = 500;
            return serverResponse.end("An error occurred");
        }

        // Check the status for empty content
        let noContent = ~[204, 205, 304].indexOf(statusCode);

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
        if (body instanceof Stream) {
            return body.pipe(serverResponse);
        }
    };

    /**
     * Executed when the application ends
     */
    *onApplicationEnd()
    {
        if (this.isStarted) {
            console.log('\nSolfegeJS HTTP server stopped');
        }
    }
}



