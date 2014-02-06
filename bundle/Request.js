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

}, 'solfege.bundle.server.Request');
var proto = Request.prototype;

/**
 * The original request
 *
 * @type {Object}
 */
proto.serverRequest;

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



module.exports = Request;
