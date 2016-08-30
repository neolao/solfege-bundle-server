import co from "co";
import http from "http";
import bindGenerator from "bind-generator";
import {fn as isGenerator} from "is-generator";
import Request from "./Request";
import Response from "./Response";

/**
 * A simple HTTP server
 */
export default class HttpServer
{
    /**
     * Constructor
     *
     * @param   {string}    name    Server name
     */
    constructor(name:string)
    {
        this.name = name;
        this.middlewares = [];
    }

    /**
     * Get server name
     *
     * @return  {string}    Server name
     */
    getName():string
    {
        return this.name;
    }

    /**
     * Set server name
     *
     * @param   {string}    name    Server name
     */
    setName(name:string)
    {
        this.name = name;
    }

    /**
     * Add middlewares
     *
     * @param   {Array}     middlewares     Middlewares
     */
    addMiddlewares(middlewares:Array)
    {
        this.middlewares = middlewares;
    }

    /**
     * Start the server
     *
     * @param   {uint32}    port        Server port
     * @param   {function}  listener    Server listener
     */
    start(port:uint32, listener = null)
    {
        // Build middlewares defined in services
        let middlewareDecorator = this.buildMiddlewareDecorator(listener);

        // Create the server
        const server = http.createServer((request, response) =>
        {
            let customRequest = new Request(request);
            let customResponse = new Response(response);

            middlewareDecorator(customRequest, customResponse);
        });

        server.listen(port);
        console.log(`Server started on port ${port}`);
    }

    /**
     * Build middleware decorator
     *
     * @param   {function}  lastMiddleware  The last middleware
     * @return  {function}                  The decodator
     */
    buildMiddlewareDecorator(lastMiddleware = null)
    {
        let self = this;
        let emptyMiddlewareHandler = function*(){};

        // Add the last middle
        let middlewares = this.middlewares.slice(0);
        if (typeof lastMiddleware === "function") {
            middlewares.splice(1, 0, {
                handle: function*(request, response, next) {
                    lastMiddleware(request, response);

                    yield *next;
                }
            });
        }

        // Build the top decorator
        return co.wrap(function*(request, response, next)
        {
            // Start to the end of the list
            // The previous middleware is the argument of the current one, etc.
            let index = middlewares.length;
            let previousMiddlewareHandler = next || emptyMiddlewareHandler();

            while (index--) {
                let instance = middlewares[index];
                let handler = instance.handle;
                if (!isGenerator(handler)) {
                    throw new Error("Middleware "+instance+" must have generator method handle()");
                }

                let currentMiddlewareHandler = bindGenerator(instance, handler);
                previousMiddlewareHandler = currentMiddlewareHandler(request, response, previousMiddlewareHandler);
            }

            yield *previousMiddlewareHandler;
        });
    }
}



