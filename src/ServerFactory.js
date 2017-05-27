import HttpServer from "./HttpServer";

/**
 * Server factory
 */
export default class ServerFactory
{
    /**
     * Constructor
     */
    constructor()
    {
        // Server instances
        this.servers = {};

        // Middlewares by server
        this.middlewares = {};
    }

    /**
     * Create a server
     *
     * @param   {string}        name    Server name
     * @return  {HttpServer}            Server instance
     */
    create(name:string = "default"):HttpServer
    {
        // Build instance
        // and add middlewares
        let server = new HttpServer(name);
        let middlewares = [];
        if (Array.isArray(this.middlewares[name])) {
            for (let middleware of this.middlewares[name]) {
                middlewares.push(middleware.instance);
            }
            server.addMiddlewares(middlewares);
        }


        this.servers[name] = server;

        return server;
    }

    /**
     * Get server names
     *
     * @return  {Array}                 Server names
     */
    getServerNames()
    {
        let names = [];

        for (let name in this.servers) {
            if (names.indexOf(name) === -1) {
                names.push(name);
            }
        }

        for (let name in this.middlewares) {
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
        return this.servers[name];
    }

    /**
     * Add server middleware
     *
     * @param   {string}    serverName  Server name
     * @param   {object}    middleware  Middleware instance
     * @param   {uint32}    priority    Priority
     */
    addMiddleware(serverName:string, middleware, priority:uint32)
    {
        if (!Array.isArray(this.middlewares[serverName])) {
            this.middlewares[serverName] = [];
        }

        // Add middleware to the list
        this.middlewares[serverName].push({
            instance: middleware,
            priority: priority
        });

        // Sort by priority
        this.middlewares[serverName].sort((a, b) => {
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
        if (!Array.isArray(this.middlewares[serverName])) {
            this.middlewares[serverName] = [];
        }

        return this.middlewares[serverName].slice(0);
    }
}



