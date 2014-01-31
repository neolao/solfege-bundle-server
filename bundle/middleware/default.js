module.exports = function*(next)
{
    // Set the default header "X-Powered-By"
    this.response.setHeader('X-Powered-By', 'SolfegeJS');

    // Handle the next middleware
    yield *next;

    // Finish with the default message
    this.response.end('SolfegeJS server');
};
