/* @flow */
import {parse as parseUrl} from "url"
import {parse as parseQueryString} from "querystring"
import getRawBody from "raw-body"
import formidable from "formidable"
import accepts from "accepts"
import type {RequestInterface} from "../interface"

// Private properties/methods
const serverRequest = Symbol();
const url = Symbol();
const urlParts = Symbol();
const query = Symbol();
const accept = Symbol();
const parameters = Symbol();
const fields = Symbol();
const files = Symbol();
const rawBody = Symbol();

/**
 * A request
 */
export default class Request implements RequestInterface
{
    /**
     * Original request
     */
    // $FlowFixMe
    [serverRequest]:Object;

    /**
     * Request URL
     */
    // $FlowFixMe
    [url]:string;

    /**
     * Parts of the URL
     */
    // $FlowFixMe
    [urlParts]:Object;

    /**
     * Query
     */
    // $FlowFixMe
    [query]:Object;

    /**
     * Accept informations
     */
    // $FlowFixMe
    [accept]:Object;

    /**
     * Parameters
     */
    // $FlowFixMe
    [parameters]:Object;

    /**
     * Constructor
     *
     * @param   {Object}    serverRequest       The original request
     */
    constructor(serverRequest:Object):void
    {
        // Save the original request
        // $FlowFixMe
        this[serverRequest] = serverRequest;

        // Copy some informations
        // $FlowFixMe
        this[url] = serverRequest.url;

        // Parse the URL
        // $FlowFixMe
        this[urlParts] = parseUrl(serverRequest.url);
        // $FlowFixMe
        this[query] = null;

        // Initialize the parameters
        // $FlowFixMe
        this[parameters] = {};

        // The fields sent
        // $FlowFixMe
        this[fields] = null;

        // The files sent
        // $FlowFixMe
        this[files] = null;

        // The raw body
        // $FlowFixMe
        this[rawBody] = null;

        // The helper that parse the headers to get informations like charsets, encodings, etc.
        // $FlowFixMe
        this[accept] = accepts(serverRequest);
    }

    /**
     * Get original request
     *
     * @return  {Object}    Original request
     */
    getServerRequest():Object
    {
        // $FlowFixMe
        return this[serverRequest];
    }

    /**
     * Method of the request
     *
     * @return  {String}    HTTP method
     */
    getMethod():string
    {
        return this.getServerRequest().method;
    }

    /**
     * Protocol of the request
     *
     * @return  {string}    Protocol
     */
    getProtocol():string
    {
        // $FlowFixMe
        return this[urlParts].protocol;
    }

    /**
     * Host of the request
     *
     * @return  {string}    Host
     */
    getHost():string
    {
        // $FlowFixMe
        return this[urlParts].host;
    }

    /**
     * Hostname of the request
     *
     * @return  {string}    Hostname
     */
    getHostname():string
    {
        // $FlowFixMe
        return this[urlParts].hostname;
    }

    /**
     * Get port of the request
     *
     * @return  {number}    Port
     */
    getPort():number
    {
        // $FlowFixMe
        return this[urlParts].port;
    }

    /**
     * Get pathname of the request
     *
     * @return  {string}    Pathname
     */
    getPathname():string
    {
        // $FlowFixMe
        return this[urlParts].pathname;
    }

    /**
     * Get query string of the request
     *
     * @return  {string}    Query string
     */
    getQueryString():string
    {
        // $FlowFixMe
        return this[urlParts].query;
    }

    /**
     * Get query of the request
     *
     * @return  {Object}    Query
     */
    getQuery():Object
    {
        // $FlowFixMe
        if (this[query]) {
            return this[query];
        }

        const queryString:string = this.getQueryString();
        const queryObject:Object = parseQueryString(queryString);

        // $FlowFixMe
        this[query] = queryObject;

        return queryObject;
    }

    /**
     * Get hash
     *
     * @return  {string}    Hash
     */
    getHash():string
    {
        // $FlowFixMe
        return this[urlParts].hash;
    }

    /**
     * Get a header
     *
     * @param   {String}    name    Header name
     * @return  {String}            Header value
     */
    getHeader(name:string):string
    {
        name = name.toLowerCase();
        return this.getServerRequest().headers[name];
    }

    /**
     * Get a parameter value
     *
     * @param   {String}    name    The parameter name
     * @return  {any}               The parameter value
     */
    getParameter(name:string):any
    {
        // $FlowFixMe
        return this[parameters][name];
    }

    /**
     * Set a parameter value
     *
     * @param   {String}    name    The parameter name
     * @param   {any}               The parameter value
     */
    setParameter(name:string, value:any):void
    {
        // $FlowFixMe
        this[parameters][name] = value;
    }

    /**
     * Get the raw body
     *
     * @param   {Object}    options     The options (see "raw-body" module)
     * @return  {String}                The raw body
     */
    *getRawBody(options:Object):Generator<*,string,*>
    {
        // $FlowFixMe
        if (this[rawBody] !== null) {
            return this[rawBody];
        }

        const serverRequest:Object = this.getServerRequest();
        const result:string = yield getRawBody(serverRequest, options);
        // $FlowFixMe
        this[rawBody] = result;
        return result;
    }

    /**
     * Get the fields
     *
     * @return  {Object}    The fields
     */
    *getFields():Generator<*,Object,*>
    {
        // Get the cached property
        // $FlowFixMe
        if (this[fields] !== null) {
            return this[fields];
        }

        let data = yield this.getFieldsAndFiles();
        return data.fields;
    }


    /**
     * Get the files
     *
     * @return  {Object}    The files
     */
    *getFiles():Generator<*,Object,*>
    {
        // Get the cached property
        // $FlowFixMe
        if (this[files] !== null) {
            return this[files];
        }

        let data = yield this.getFieldsAndFiles();
        return data.files;
    }

    /**
     * Get the fields and files
     *
     * @return  {Object}    The object containing the fields and files
     */
    *getFieldsAndFiles():Generator<*,Object,*>
    {
        // Get the cached properties
        // $FlowFixMe
        if (this[fields] !== null && this[files] !== null) {
            return {
                fields: this[fields],
                files: this[files]
            };
        }

        // Extract the properties from the request
        return new Promise((resolve, reject) => {
            let form = formidable.IncomingForm();
            form.parse(self.serverRequest, (error, parsedFields, parsedFiles) => {
                if (error) {
                    reject(error);
                    return;
                }

                // $FlowFixMe
                this[fields] = parsedFields;
                // $FlowFixMe
                this[files] = parsedFiles;
                resolve({
                    fields: parsedFields,
                    files: parsedFiles
                });
            });
        });
    }

    /**
     * Return the first accepted charset.
     * If nothing in charsets is accepted, then false is returned.
     *
     * @param   {array}     charsets    Accepted charsets
     * @return  {string}                First accepted charset
     */
    getFirstAcceptedCharset(...charsets:Array<string>):string
    {
        // $FlowFixMe
        return this[accept].charset(charsets);
    }

    /**
     * Return the charsets that the request accepts,
     * in the order of the client's preference (most preferred first).
     *
     * @return  {Array}     The charsets
     */
    getCharsets():Array<string>
    {
        // $FlowFixMe
        return this[accept].charsets();
    }

    /**
     * Return the first accepted encoding.
     * If nothing in encodings is accepted, then false is returned.
     *
     * @param   {array}     encodings   Accepted encodings
     * @return  {string}                First accepted encoding
     */
    getFirstAcceptedEncoding(...encodings:Array<string>):string
    {
        // $FlowFixMe
        return this[accept].encoding(encodings);
    }

    /**
     * Return the encodings that the request accepts,
     * in the order of the client's preference (most preferred first).
     *
     * @return  {Array}     The encodings
     */
    getEncodings():Array<string>
    {
        // $FlowFixMe
        return this[accept].encodings();
    }

    /**
     * Return the first accepted language.
     * If nothing in languages is accepted, then false is returned.
     *
     * @param   {array}     languages   Accepted languages
     * @return  {string}                First accepted language
     */
    getFirstAcceptedLanguage(...languages:Array<string>):string
    {
        // $FlowFixMe
        return this[accept].language(languages);
    }

    /**
     * Return the languages that the request accepts,
     * in the order of the client's preference (most preferred first).
     *
     * @return  {array}     The languages
     */
    getLanguages():Array<string>
    {
        // $FlowFixMe
        return this[accept].languages();
    }

    /**
     * Return the first accepted type
     * (and it is returned as the same text as what appears in the types array).
     * If nothing in types is accepted, then false is returned.
     *
     * @param   {Array}     types   Accepted types
     * @return  {string}            First accepted type
     */
    getFirstAcceptedType(...types:Array<string>):string
    {
        // $FlowFixMe
        return this[accept].type(types);
    }

    /**
     * Return the types that the request accepts,
     * in the order of the client's preference (most preferred first).
     *
     * @return  {Array}     The types
     */
    getTypes():Array<string>
    {
        // $FlowFixMe
        return this[accept].types();
    }
}

