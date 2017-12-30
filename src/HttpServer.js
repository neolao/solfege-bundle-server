/* @flow*/
import http from "http"
import Request from "./Request"
import Response from "./Response"
import type {MiddlewareInterface} from "../interface"
import {bind} from "decko"
import isAsync from "is-es7-async"

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
        // Create the server
        const server = http.createServer((request, response) =>
        {
            const customRequest:Request = new Request(request);
            const customResponse:Response = new Response(response);

            // Build middlewares defined in services
            const middlewareDecorator = this.buildMiddlewareDecorator(customRequest, customResponse, this.listener);
            middlewareDecorator();
        });

        server.listen(this.port);
    }

    /**
     * Build middleware decorator
     *
     * @param   {function}  lastMiddleware  The last middleware
     * @param   {Request}   request         Request
     * @param   {Response}  response        Response
     * @return  {function}                  The decorator
     */
    buildMiddlewareDecorator(request:Request, response:Response, lastMiddleware:Function):Function
    {
        // Add the last middle
        let middlewares = this.middlewares.slice(0);
        if (typeof lastMiddleware === "function") {
            middlewares.splice(1, 0, {
                handle: async function(request, response, next) {
                    if (isAsync(lastMiddleware)) {
                        await lastMiddleware(request, response);
                    } else {
                        lastMiddleware(request, response);
                    }

                    await next();
                }
            });
        }

        // Start to the end of the list
        // The previous middleware is the argument of the current one, etc.
        let index = middlewares.length;
        let previousMiddlewareHandler = async () => {};
        let currentMiddlewareHandler = async () => {};

        while (index--) {
            currentMiddlewareHandler = this.decorateMiddleware(
                middlewares[index],
                previousMiddlewareHandler,
                request,
                response
            );
            previousMiddlewareHandler = currentMiddlewareHandler;
        }


        // Build the top decorator
        return async function()
        {
            await currentMiddlewareHandler();
        }
    }

    /**
     * Decorate middleware
     */
    @bind
    decorateMiddleware(middleware:any, previousHandler:Function, request:Request, response:Response)
    {
        if (typeof middleware.handle !== "function") {
            throw new Error("Middleware "+String(middleware)+" must have method handle()");
        }

        let currentHandler = async () => {
            if (isAsync(middleware.handle)) {
                await middleware.handle(request, response, previousHandler);
            } else {
                middleware.handle(request, response, previousHandler);
            }
        };
        return currentHandler;
    }
}
