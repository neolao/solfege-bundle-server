var solfege = require('solfegejs');

/**
 * A request
 *
 * @param   {Object}    serverRequest       The original request
 */
var Request = solfege.util.Class.create(function(serverRequest)
{
    // Save the original request
    this.serverRequest = serverRequest;

    // Copy some informations
    this.url = serverRequest.url;

    // Initialize the parameters
    this.parameters = {};

}, 'solfege.bundle.server.Request');
var proto = Request.prototype;

/**
 * The original request
 *
 * @type {Object}
 * @api public
 */
proto.serverRequest;

/**
 * The parameters
 *
 * @type {Object}
 * @api private
 */
proto.parameters;

/**
 * The request URL
 *
 * @type {String}
 * @api public
 */
proto.url;

/**
 * The method of the request
 *
 * @type {String}
 * @api public
 */
Object.defineProperty(proto, 'method',
{
    get: function()
    {
        return this.serverRequest.method;
    }
});

/**
 * Get a header
 *
 * @param   {String}    name    The header name
 * @return  {String}            The header value
 */
proto.getHeader = function(name)
{
    name = name.toLowerCase();
    return this.serverRequest.headers[name];
};

/**
 * Get a parameter value
 *
 * @param   {String}    name    The parameter name
 * @return  {any}               The parameter value
 */
proto.getParameter = function(name)
{
    return this.parameters[name];
};

/**
 * Set a parameter value
 *
 * @param   {String}    name    The parameter name
 * @param   {any}               The parameter value
 */
proto.setParameter = function(name, value)
{
    this.parameters[name] = value;
};


module.exports = Request;
