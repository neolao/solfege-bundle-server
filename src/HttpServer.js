/* @flow*/
import co from "co"
import http from "http"
import bindGenerator from "bind-generator"
import {fn as isGenerator} from "is-generator"
import Request from "./Request"
import Response from "./Response"
import type {RequestInterface, ResponseInterface, MiddlewareInterface} from "../interface"

/**
 * A simple HTTP server
 */
export default class HttpServer
{
    /**
     * Server name
     */
    name:string;

    /**
     * Middlewares
     */
    middlewares:Array<MiddlewareInterface>;

    /**
     * Constructor
     *
     * @param   {string}    name    Server name
     */
    constructor(name:string):void
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
    setName(name:string):void
    {
        this.name = name;
    }

    /**
     * Add middlewares
     *
     * @param   {Array}     middlewares     Middlewares
     */
    addMiddlewares(middlewares:Array<MiddlewareInterface>)
    {
        this.middlewares = middlewares;
    }

    /**
     * Start the server
     *
     * @param   {uint32}    port        Server port
     * @param   {function}  listener    Server listener
     */
    start(port:number, listener?:Function)
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
    }

    /**
     * Build middleware decorator
     *
     * @param   {function}  lastMiddleware  The last middleware
     * @return  {function}                  The decodator
     */
    buildMiddlewareDecorator(lastMiddleware?:Function)
    {
        let self = this;
        let emptyMiddlewareHandler = function*(){};

        // Add the last middle
        let middlewares = this.middlewares.slice(0);
        if (typeof lastMiddleware === "function") {
            middlewares.splice(1, 0, {
                handle: function*(request, response, next) {
                    // $FlowFixMe
                    lastMiddleware(request, response);

                    if (next) {
                        yield *next;
                    }
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
                let instance:MiddlewareInterface = middlewares[index];
                let handler = instance.handle;
                if (!isGenerator(handler)) {
                    throw new Error("Middleware "+String(instance)+" must have generator method handle()");
                }

                let currentMiddlewareHandler = bindGenerator(instance, handler);
                previousMiddlewareHandler = currentMiddlewareHandler(request, response, previousMiddlewareHandler);
            }

            yield *previousMiddlewareHandler;
        });
    }
}
