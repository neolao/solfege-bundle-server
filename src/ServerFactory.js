/* @flow */
import HttpServer from "./HttpServer"
import type {MiddlewareInterface} from "../interface"

// Private properties/methods
const servers = Symbol();
const middlewares = Symbol();

/**
 * Server factory
 */
export default class ServerFactory
{
    /**
     * Server instances
     */
    // $FlowFixMe
    [servers]:{[key:string]:HttpServer};

    /**
     * Middleware by server
     */
    // $FlowFixMe
    [middlewares]:{[key:string]:MiddlewareInterface};

    /**
     * Constructor
     */
    constructor():void
    {
        // Server instances
        // $FlowFixMe
        this[servers] = {};

        // Middlewares by server
        // $FlowFixMe
        this[middlewares] = {};
    }

    /**
     * Create a server
     *
     * @param   {string}        name    Server name
     * @return  {HttpServer}            Server instance
     */
    create(name:string = "default"):HttpServer
    {
        // $FlowFixMe
        let middlewaresByServer = this[middlewares];

        // Build instance
        // and add middlewares
        let server = new HttpServer(name);
        let middlewareInstances:Array<MiddlewareInterface> = [];
        if (middlewaresByServer.hasOwnProperty(name) && Array.isArray(middlewaresByServer[name])) {
            for (let middleware of middlewaresByServer[name]) {
                middlewareInstances.push(middleware.instance);
            }
            server.addMiddlewares(middlewareInstances);
        }

        // $FlowFixMe
        let serverInstances = this[servers];
        serverInstances[name] = server;

        return server;
    }

    /**
     * Get server names
     *
     * @return  {Array}                 Server names
     */
    getServerNames():Array<string>
    {
        let names = [];

        // $FlowFixMe
        const serverInstances = this[servers];
        for (let name in serverInstances) {
            if (names.indexOf(name) === -1) {
                names.push(name);
            }
        }

        // $FlowFixMe
        const middlewaresByServer = this[middlewares];
        for (let name in middlewaresByServer) {
            if (names.indexOf(name) === -1) {
                names.push(name);
            }
        }

        return names;
    }

    /**
     * Get server by its name
     *
     * @param   {string}        name    Server name
     * @return  {HttpServer}            Server instance
     */
    getServer(name:string = "default"):HttpServer
    {
        // $FlowFixMe
        const serverInstances = this[servers];

        if (!serverInstances.hasOwnProperty(name)) {
            throw new Error(`HTTP server not found: ${name}`);
        }

        return serverInstances[name];
    }

    /**
     * Add server middleware
     *
     * @param   {string}                serverName  Server name
     * @param   {MiddlewareInterface}   middleware  Middleware instance
     * @param   {uint32}                priority    Priority
     */
    addMiddleware(serverName:string, middleware:MiddlewareInterface, priority:number)
    {
        // $FlowFixMe
        const middlewaresByServer = this[middlewares];

        if (!middlewaresByServer.hasOwnProperty(serverName)) {
            middlewaresByServer[serverName] = [];
        }

        // Add middleware to the list
        middlewaresByServer[serverName].push({
            instance: middleware,
            priority: priority
        });

        // Sort by priority
        middlewaresByServer[serverName].sort((a, b) => {
            if (a.priority < b.priority) {
                return -1;
            }
            if (a.priority > b.priority) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * Get server middlewares
     *
     * @param   {string}    serverName      Server name
     * @return  {Array}                     Middlewares
     */
    getMiddlewares(serverName:string)
    {
        // $FlowFixMe
        const middlewaresByServer = this[middlewares];

        if (!middlewaresByServer.hasOwnProperty(serverName)) {
            middlewaresByServer[serverName] = [];
        }

        const serverMiddlewares = middlewaresByServer[serverName];
        return serverMiddlewares.slice(0);
    }
}

