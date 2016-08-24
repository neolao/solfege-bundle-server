/**
 * Default middleware
 */
export default class DefaultMiddleware
{
    /**
     * Handle a request
     *
     * @param   {Request}   request     The request
     * @param   {Response}  response    The response
     * @param   {object}    next        The next middleware
     */
    *handle(request, response, next)
    {
        yield *next;

        console.log("render");
        return response.serverResponse.end("Not found");
    }
}
