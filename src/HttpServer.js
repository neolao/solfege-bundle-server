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
     * Port number
     */
    port:number;

    /**
     * Listener
     */
    listener:Function;

    /**
     * Middlewares
     */
    middlewares:Array<MiddlewareInterface>;

    /**
     * Constructor
     *
     * @param   {string}    name        Server name
     * @param   {number}    port        Server port
     * @param   {Function}  listener    Listener
     */
    constructor(name:string, port:number = 8080, listener?:Function):void
    {
        this.name = name;
        this.port = port;
        if (typeof listener === "function") {
            this.listener = listener;
        }
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
     * Get server port
     *
     * @return  {number}    Server port
     */
    getPort():number
    {
        return this.port;
    }

    /**
     * Set server port
     *
     * @param   {number}    port    Server port
     */
    setPort(port:number):void
    {
        this.port = port;
    }

    /**
     * Get server listener
     *
     * @return  {Function}  Listener
     */
    getListener():Function
    {
        return this.listener;
    }

    /**
     * Set server listener
     *
     * @param   {Function}  listener    Listener
     */
    setListener(listener:Function):void
    {
        this.listener = listener;
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
     */
    start()
    {
        // Build middlewares defined in services
        const middlewareDecorator = this.buildMiddlewareDecorator(this.listener);

        // Create the server
        const server = http.createServer((request, response) =>
        {
            const customRequest:RequestInterface = new Request(request);
            const customResponse:ResponseInterface = new Response(response);

            middlewareDecorator(customRequest, customResponse);
        });

        server.listen(this.port);
    }

    /**
     * Build middleware decorator
     *
     * @param   {function}  lastMiddleware  The last middleware
     * @return  {function}                  The decodator
     */
    buildMiddlewareDecorator(lastMiddleware?:Function)
    {
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
