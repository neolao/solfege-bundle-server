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

    // Handle the next middleware
    yield *next;

    // Finish with the default message
    response.end('SolfegeJS server');
};
