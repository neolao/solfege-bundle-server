import solfege from "solfegejs";
import getRawBody from "raw-body";
import formidable from "formidable";

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

        // The fields sent
        this.fields = null;

        // The files sent
        this.files = null;

        // The raw body
        this.rawBody = null;
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
            form.parse(this.serverRequest, function(error, fields, files) {
                if (error) {
                    reject(error);
                    return;
                }

                self.fields = fields;
                self.files = files;
                return {
                    fields: fields,
                    files: files
                };
            });
        });
    }
}

