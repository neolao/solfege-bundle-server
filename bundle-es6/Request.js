import solfege from "solfegejs";

/**
 * A request
 */
export default class Request
{
    /**
     * Constructor
     *
     * @param   {Object}    serverRequest       The original request
     */
    constructor(serverRequest)
    {
        // Save the original request
        this.serverRequest = serverRequest;

        // Copy some informations
        this.url = serverRequest.url;

        // Initialize the parameters
        this.parameters = {};

    }

    /**
     * The method of the request
     *
     * @type {String}
     * @api public
     */
    get method()
    {
        return this.serverRequest.method;
    }

    /**
     * Get a header
     *
     * @param   {String}    name    The header name
     * @return  {String}            The header value
     */
    getHeader(name)
    {
        name = name.toLowerCase();
        return this.serverRequest.headers[name];
    }

    /**
     * Get a parameter value
     *
     * @param   {String}    name    The parameter name
     * @return  {any}               The parameter value
     */
    getParameter(name)
    {
        return this.parameters[name];
    }

    /**
     * Set a parameter value
     *
     * @param   {String}    name    The parameter name
     * @param   {any}               The parameter value
     */
    setParameter(name, value)
    {
        this.parameters[name] = value;
    }

}

