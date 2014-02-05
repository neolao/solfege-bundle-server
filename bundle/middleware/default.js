/**
 * The default middleware
 *
 * @param   {Object}                request     The request
 * @param   {Object}                response    The response
 * @param   {GeneratorFunction}     next        The next function
 */
module.exports = function*(request, response, next)
{
    // Set the default header "X-Powered-By"
    response.setHeader('X-Powered-By', 'SolfegeJS');

    // Set the default body
    response.body = null;

    // Handle the next middleware
    yield *next;

    // Get variables
    var body = response.body;
    var method = request.method;

    // No body
    if (null === body) {
        return response.end();
    }

    // Stream body
    if ('function' == typeof body.pipe) {
        return body.pipe(response);
    }

    console.log('end');
    // Finish with the default message
    //response.end('SolfegeJS server');
};
