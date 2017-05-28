/* @flow */
import http from "http"
import type {ResponseInterface} from "../interface"

// Private properties/methods
const serverResponse = Symbol();
const body = Symbol();

/**
 * A response
 */
export default class Response implements ResponseInterface
{
    /**
     * Original response
     */
    // $FlowFixMe
    [serverResponse]:Object;

    /**
     * Parameters
     */
    parameters:Object;

    /**
     * Body
     */
    // $FlowFixMe
    [body]:*;

    /**
     * Constructor
     *
     * @param   {Object}    serverResponse      Original response
     */
    constructor(serverResponse:Object)
    {
        // Save the original response
        // $FlowFixMe
        this[serverResponse] = serverResponse;

        // Set default values
        this.parameters = {};
    }

    /**
     * Get original response
     *
     * @return  {*}     Original response
     */
    getServerResponse():*
    {
        // $FlowFixMe
        return this[serverResponse];
    }

    /**
     * Set header
     *
     * @param   {string}    name    Header name
     * @param   {string}    value   Header value
     */
    setHeader(name:string, value:string):void
    {
        this.getServerResponse().setHeader(name, value);
    }

    /**
     * Get header
     *
     * @param   {string}    name    Header name
     * @return  {string}            Header value
     */
    getHeader(name:string):string
    {
        return this.getServerResponse().getHeader(name);
    }

    /**
     * Remove header
     *
     * @param   {string}    name    Header name
     */
    removeHeader(name:string):void
    {
        this.getServerResponse().removeHeader(name);
    }

    /**
     * Get status code
     *
     * @return  {number}    Status code
     */
    getStatusCode():number
    {
        return this.getServerResponse().statusCode;
    }

    /**
     * Set status code
     *
     * @param   {number}    value   Status code
     */
    setStatusCode(value:number):void
    {
        this.getServerResponse().statusCode = value;
    }

    /**
     * The status code
     *
     * @type {Number}
     * @api public
     */
    get statusCode():number
    {
        return this.getStatusCode();
    }
    set statusCode(value:number):void
    {
        this.setStatusCode(value);
    }

    /**
     * Get status string
     *
     * @return  {string}    Status string
     */
    getStatusString():string
    {
        const statusCode = this.getStatusCode();
        return http.STATUS_CODES[statusCode];
    }


    /**
     * The status string
     *
     * @type {String}
     * @api public
     */
    get statusString():string
    {
        return this.getStatusString();
    }

    /**
     * Indicates that the headers are sent
     *
     * @return  {boolean}   true if the headers are sent, false otherwise
     */
    areHeadersSent():boolean
    {
        return this.getServerResponse().headersSent;
    }

    /**
     * Indicates that the headers are sent
     *
     * @type {Boolean}
     * @api public
     */
    get headerisSent():boolean
    {
        return this.areHeadersSent();
    }

    /**
     * Set response body
     *
     * @param   {*}     value   Body value
     */
    setBody(value:*):void
    {
        // $FlowFixMe
        this[body] = value;

        // No content
        if (null === value) {
            this.removeHeader('Content-Type');
            this.removeHeader('Content-Length');
            this.removeHeader('Transfer-Encoding');
            return;
        }
    }

    /**
     * Get response body
     *
     * @return  {*}     Body value
     */
    getBody():*
    {
        // $FlowFixMe
        return this[body];
    }


    /**
     * The response body
     *
     * @type {any}
     * @api public
     */
    get body():*
    {
        return this.getBody();
    }
    set body(value:*):void
    {
        this.setBody(value);
    }

    /**
     * Get body length
     *
     * @return  {number}    Body length
     */
    getLength():number
    {
        let serverResponse = this.getServerResponse();
        let length = serverResponse._headers["content-length"];
        return ~~length;
    }

    /**
     * Set body length
     *
     * @param   {number}    value   Body length
     */
    setLength(value:number):void
    {
        this.setHeader("Content-Length", String(value));
    }

    /**
     * The body length
     */
    get length():number
    {
        return this.getLength();
    }
    set length(value:number)
    {
        this.setLength(value);
    }
}

