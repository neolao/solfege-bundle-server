/* @flow */

/**
 * Request interface
 */
export interface RequestInterface
{
    /**
     * Get URL
     *
     * @return  {string}    URL
     */
    getUrl():string;

    /**
     * Get original request
     *
     * @return  {Object}    Original request
     */
    getServerRequest():Object;

    /**
     * Get method of the request
     *
     * @return  {String}    HTTP method
     */
    getMethod():string;

    /**
     * Get protocol of the request
     *
     * @return  {string}    Protocol
     */
    getProtocol():string;

    /**
     * Get host of the request
     *
     * @return  {string}    Host
     */
    getHost():string;

    /**
     * Get hostname of the request
     *
     * @return  {string}    Hostname
     */
    getHostname():string;

    /**
     * Get port of the request
     *
     * @return  {number}    Port
     */
    getPort():number;

    /**
     * Get query string including the leading question mark
     *
     * @return  {string}    Pathname
     */
    getPathname():string;

    /**
     * Get query string of the request
     *
     * @return  {string}    Query string
     */
    getQueryString():string;

    /**
     * Get query of the request
     *
     * @return  {Object}    Query
     */
    getQuery():Object;

    /**
     * Get hash
     *
     * @return  {string}    Hash
     */
    getHash():string;

    /**
     * Get a header
     *
     * @param   {String}    name    Header name
     * @return  {String}            Header value
     */
    getHeader(name:string):string;

    /**
     * Return the first accepted charset.
     * If nothing in charsets is accepted, then false is returned.
     *
     * @param   {array}     charsets    Accepted charsets
     * @return  {string}                First accepted charset
     */
    getFirstAcceptedCharset(...charsets:Array<string>):string;

    /**
     * Return the charsets that the request accepts,
     * in the order of the client's preference (most preferred first).
     *
     * @return  {Array}     The charsets
     */
    getCharsets():Array<string>;

    /**
     * Return the first accepted encoding.
     * If nothing in encodings is accepted, then false is returned.
     *
     * @param   {array}     encodings   Accepted encodings
     * @return  {string}                First accepted encoding
     */
    getFirstAcceptedEncoding(...encodings:Array<string>):string;

    /**
     * Return the encodings that the request accepts,
     * in the order of the client's preference (most preferred first).
     *
     * @return  {Array}     The encodings
     */
    getEncodings():Array<string>;

    /**
     * Return the first accepted language.
     * If nothing in languages is accepted, then false is returned.
     *
     * @param   {array}     languages   Accepted languages
     * @return  {string}                First accepted language
     */
    getFirstAcceptedLanguage(...languages:Array<string>):string;

    /**
     * Return the languages that the request accepts,
     * in the order of the client's preference (most preferred first).
     *
     * @return  {Array}     The languages
     */
    getLanguages():Array<string>;

    /**
     * Return the first accepted type
     * (and it is returned as the same text as what appears in the types array).
     * If nothing in types is accepted, then false is returned.
     *
     * @param   {Array}     types   Accepted types
     * @return  {string}            First accepted type
     */
    getFirstAcceptedType(...types:Array<string>):string;

    /**
     * Return the types that the request accepts,
     * in the order of the client's preference (most preferred first).
     *
     * @return  {Array}     The types
     */
    getTypes():Array<string>;

    /**
     * Get a parameter value
     *
     * @param   {String}    name    The parameter name
     * @return  {any}               The parameter value
     */
    getParameter(name:string):any;

    /**
     * Set a parameter value
     *
     * @param   {String}    name    The parameter name
     * @param   {any}               The parameter value
     */
    setParameter(name:string, value:any):void;
}

/**
 * Response interface
 */
export interface ResponseInterface
{
    /**
     * Get original response
     *
     * @return  {*}     Original response
     */
    getServerResponse():*;

    /**
     * Get status code
     *
     * @return  {number}    Status code
     */
    getStatusCode():number;

    /**
     * Set status code
     *
     * @param   {number}    value   Status code
     */
    setStatusCode(value:number):void;

    /**
     * Get status string
     *
     * @return  {string}    Status string
     */
    getStatusString():string;

    /**
     * Set response body
     *
     * @param   {*}     value   Body value
     */
    setBody(value:*):void;

    /**
     * Get response body
     *
     * @return  {*}     Body value
     */
    getBody():*;

    /**
     * Get body length
     *
     * @return  {number}    Body length
     */
    getLength():number;

    /**
     * Set body length
     *
     * @param   {number}    value   Body length
     */
    setLength(value:number):void;

    /**
     * Set header
     *
     * @param   {string}    name    Header name
     * @param   {string}    value   Header value
     */
    setHeader(name:string, value:string):void;

    /**
     * Get header
     *
     * @param   {string}    name    Header name
     * @return  {string}            Header value
     */
    getHeader(name:string):string;

    /**
     * Remove header
     *
     * @param   {string}    name    Header name
     */
    removeHeader(name:string):void;

    /**
     * Indicates that the headers are sent
     *
     * @return  {boolean}   true if the headers are sent, false otherwise
     */
    areHeadersSent():boolean;
}

/**
 * Middleware interface
 */
export interface MiddlewareInterface
{
    /**
     * Handle a request
     *
     * @param   {RequestInterface}  request     HTTP request
     * @param   {ResponseInterface} response    HTTP response
     * @param   {Function}          next        Next middleware handler
     */
    handle(request:RequestInterface, response:ResponseInterface, next?:Function):Generator<*,*,*>
}
