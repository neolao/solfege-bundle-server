"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var DefaultMiddleware = class DefaultMiddleware {
    *handle(request, response, next) {
        var error = void 0;
        try {
            if (next) {
                yield* next;
            }
        } catch (middlewareError) {
            error = middlewareError;
        }

        var body = response.getBody();
        var statusCode = response.getStatusCode();
        var serverResponse = response.getServerResponse();

        if (response.areHeadersSent()) {
            return;
        }

        if (error) {
            console.error(error.stack);
            serverResponse.statusCode = 500;
            return serverResponse.end("An error occurred");
        }

        var noContent = ~[204, 205, 304].indexOf(statusCode);

        if ("HEAD" === request.method) {
            noContent = true;
        }

        if (noContent) {
            if (body && "function" === typeof body.pipe) {
                body.close();
            }

            return serverResponse.end();
        }

        if (null === body || undefined === body) {
            body = response.getStatusString();
        }

        if ("string" === typeof body) {
            return serverResponse.end(body);
        }

        if (Buffer.isBuffer(body)) {
            return serverResponse.end(body);
        }

        if (body instanceof Stream) {
            return body.pipe(serverResponse);
        }

        serverResponse.setHeader("Content-Type", "text/plain");
        serverResponse.statusCode = 404;
        return serverResponse.end("Not found");
    }
};
exports.default = DefaultMiddleware;
module.exports = exports["default"];