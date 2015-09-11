import solfege from "solfegejs";
import {parse as parseUrl} from "url";
import {parse as parseQueryString} from "querystring";
import getRawBody from "raw-body";
import formidable from "formidable";
import accepts from "accepts";

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

        // Parse the URL
        this.urlParts = parseUrl(this.url);
        this._query = null;

        // Initialize the parameters
        this.parameters = {};

        // The fields sent
        this.fields = null;

        // The files sent
        this.files = null;

        // The raw body
        this.rawBody = null;

        // The helper that parse the headers to get informations like charsets, encodings, etc.
        this.accept = accepts(serverRequest);
    }

    /**
     * The method of the request
     *
     * @type {String}
     */
    get method()
    {
        return this.serverRequest.method;
    }

    /**
     * The protocol
     *
     * @type {String}
     */
    get protocol()
    {
        return this.urlParts.protocol;
    }

    /**
     * The host
     *
     * @type {String}
     */
    get host()
    {
        return this.urlParts.host;
    }

    /**
     * The hostname
     *
     * @type {String}
     */
    get hostname()
    {
        return this.urlParts.hostname;
    }

    /**
     * The port
     *
     * @type {Number}
     */
    get port()
    {
        return this.urlParts.port;
    }

    /**
     * The pathname
     *
     * @type {String}
     */
    get pathname()
    {
        return this.urlParts.pathname;
    }

    /**
     * The query string including the leading question mark
     *
     * @type {String}
     */
    get pathname()
    {
        return this.urlParts.pathname;
    }

    /**
     * The query string
     *
     * @type {String}
     */
    get queryString()
    {
        return this.urlParts.query;
    }

    /**
     * The query
     *
     * @type {Object}
     */
    get query()
    {
        if (this._query) {
            return this._query;
        }

        this._query = parseQueryString(this.queryString);

        return this._query;
    }

    /**
     * The hash
     *
     * @type {String}
     */
    get hash()
    {
        return this.urlParts.hash;
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

    /**
     * Get the raw body
     *
     * @param   {Object}    options     The options (see "raw-body" module)
     * @return  {String}                The raw body
     */
    *getRawBody(options)
    {
        if (this.rawBody !== null) {
            return this.rawBody;
        }

        let rawBody = yield getRawBody(this.serverRequest, options);
        this.rawBody = rawBody;
        return rawBody;
    }

    /**
     * Get the fields
     *
     * @return  {Object}    The fields
     */
    *getFields()
    {
        // Get the cached property
        if (this.fields !== null) {
            return this.fields;
        }

        let data = yield this.getFieldsAndFiles();
        return data.fields;
    }


    /**
     * Get the files
     *
     * @return  {Object}    The files
     */
    *getFiles()
    {
        // Get the cached property
        if (this.files !== null) {
            return this.files;
        }

        let data = yield this.getFieldsAndFiles();
        return data.files;
    }

    /**
     * Get the fields and files
     *
     * @return  {Object}    The object containing the fields and files
     */
    *getFieldsAndFiles()
    {
        // Get the cached properties
        if (this.fields !== null && this.fields !== null) {
            return {
                fields: this.fields,
                files: this.files
            };
        }

        // Extract the properties from the request
        let self = this;
        return new Promise(function(resolve, reject) {
            let form = formidable.IncomingForm();
            form.parse(self.serverRequest, function(error, fields, files) {
                if (error) {
                    reject(error);
                    return;
                }

                self.fields = fields;
                self.files = files;
                resolve({
                    fields: fields,
                    files: files
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
    acceptsCharsets(...charsets)
    {
        return this.accept.charset(charsets);
    }

    /**
     * Return the charsets that the request accepts, 
     * in the order of the client's preference (most preferred first).
     *
     * @return  {array}     The charsets
     */
    charsets()
    {
        return this.accept.charsets();
    }

    /**
     * Return the first accepted encoding. 
     * If nothing in encodings is accepted, then false is returned.
     *
     * @param   {array}     encodings   Accepted encodings
     * @return  {string}                First accepted encoding
     */
    acceptsEncodings(...encodings)
    {
        return this.accept.encoding(encodings);
    }

    /**
     * Return the encodings that the request accepts, 
     * in the order of the client's preference (most preferred first).
     *
     * @return  {array}     The encodings
     */
    encodings()
    {
        return this.accept.encodings();
    }

    /**
     * Return the first accepted language. 
     * If nothing in languages is accepted, then false is returned.
     *
     * @param   {array}     languages   Accepted languages
     * @return  {string}                First accepted language
     */
    acceptsLanguages(...languages)
    {
        return this.accept.language(languages);
    }

    /**
     * Return the languages that the request accepts, 
     * in the order of the client's preference (most preferred first).
     *
     * @return  {array}     The languages
     */
    languages()
    {
        return this.accept.languages();
    }

    /**
     * Return the first accepted type 
     * (and it is returned as the same text as what appears in the types array). 
     * If nothing in types is accepted, then false is returned.
     *
     * @param   {array}     types   Accepted types
     * @return  {string}            First accepted type
     */
    acceptsTypes(...types)
    {
        return this.accept.type(types);
    }

    /**
     * Return the types that the request accepts, 
     * in the order of the client's preference (most preferred first).
     *
     * @return  {array}     The types
     */
    types()
    {
        return this.accept.types();
    }
}

