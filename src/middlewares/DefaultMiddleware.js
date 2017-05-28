/* @flow */
import type {RequestInterface, ResponseInterface, MiddlewareInterface} from "../../interface"

/**
 * Default middleware
 */
export default class DefaultMiddleware implements MiddlewareInterface
{
    /**
     * Handle a request
     *
     * @param   {RequestInterface}  request     HTTP request
     * @param   {ResponseInterface} response    HTTP response
     * @param   {Function}          next        Next middleware handler
     */
    *handle(request:RequestInterface, response:ResponseInterface, next?:Function):Generator<*,*,*>
    {
        // Handle the next middleware
        let error;
        try {
            if (next) {
                yield *next;
            }
        } catch (middlewareError) {
            error = middlewareError;
        }

        // Variables
        let body = response.getBody();
        let statusCode = response.getStatusCode();
        let serverResponse = response.getServerResponse();

        // If the headers are sent, then do nothing
        if (response.areHeadersSent()) {
            return;
        }

        // Handle the error
        if (error) {
            console.error(error.stack);
            serverResponse.statusCode = 500;
            return serverResponse.end("An error occurred");
        }

        // Check the status for empty content
        let noContent = ~[204, 205, 304].indexOf(statusCode);

        // Check if the request method is "HEAD"
        // Note: The HEAD method is identical to GET except that the server MUST NOT return a message-body in the response.
        if ("HEAD" === request.method) {
            noContent = true;
        }

        // No content
        if (noContent) {

            // Close the stream if necessary
            if (body && "function" === typeof body.pipe) {
                body.close();
            }

            return serverResponse.end();
        }

        // No body
        // Display the status string in the body
        if (null === body || undefined === body) {
            body = response.getStatusString();
        }

        // String body
        if ("string" === typeof body) {
            return serverResponse.end(body);
        }

        // Buffer body
        if (Buffer.isBuffer(body)) {
            return serverResponse.end(body);
        }

        // Stream body
        // $FlowFixMe Flow does not know Stream type
        if (body instanceof Stream) {
            return body.pipe(serverResponse);
        }

        // File not found
        serverResponse.setHeader("Content-Type", "text/plain");
        serverResponse.statusCode = 404;
        return serverResponse.end("Not found");
    }
}
