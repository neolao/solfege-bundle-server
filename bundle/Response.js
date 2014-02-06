var solfege = require('solfegejs');
var http = require('http');

/**
 * A response
 *
 * @param   {Object}    serverResponse      The original response
 */
var Response = solfege.util.Class.create(function(serverResponse)
{
    // Save the original response
    this.serverResponse = serverResponse;

    // Copy some function and informations
    this.setHeader = serverResponse.setHeader.bind(serverResponse);
    this.removeHeader = serverResponse.removeHeader.bind(serverResponse);

    // Set default values
    this.statusCode = 404;
    this.body = null;

}, 'solfege.bundle.server.Response');
var proto = Response.prototype;

/**
 * The original response
 *
 * @type {Object}
 * @api private
 */
proto.serverResponse;

/**
 * Set a header
 *
 * @type {Function}
 * @api public
 */
proto.setHeader;

/**
 * Remove a header
 *
 * @type {Function}
 * @api public
 */
proto.removeHeader;

/**
 * The private body
 *
 * @type {any}
 * @api private
 */
proto._body;

/**
 * The status code
 *
 * @type {Number}
 * @api public
 */
Object.defineProperty(proto, 'statusCode',
{
    get: function()
    {
        return this.serverResponse.statusCode;
    },
    set: function(value)
    {
        this.serverResponse.statusCode = value;
    }
});

/**
 * The status string
 *
 * @type {String}
 * @api public
 */
Object.defineProperty(proto, 'statusString',
{
    get: function()
    {
        return http.STATUS_CODES[this.statusCode];
    }
});

/**
 * Indicates that the headers are sent
 *
 * @type {Boolean}
 * @api public
 */
Object.defineProperty(proto, 'headersSent',
{
    get: function()
    {
        return this.serverResponse.headersSent;
    }
});

/**
 * The response body
 *
 * @type {any}
 * @api public
 */
Object.defineProperty(proto, 'body',
{
    get: function()
    {
        return this._body;
    },
    set: function(value)
    {
        this._body = value;

        // No content
        if (null === value) {
            this.removeHeader('Content-Type');
            this.removeHeader('Content-Length');
            this.removeHeader('Transfer-Encoding');
            return;
        }

    }
});

/**
 * The body length
 *
 * @type {Number}
 * @api public
 */
Object.defineProperty(proto, 'length',
{
    get: function()
    {
        var length = this.serverResponse._headers['content-length'];

        return ~~length;
    },
    set: function(value)
    {
        this.setHeader('Content-Length', value);
    }
});

module.exports = Response;
