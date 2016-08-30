import MiddlewareCompilerPass from "./DependencyInjection/Compiler/MiddlewareCompilerPass";

/**
 * Server bundle
 */
export default class Bundle
{
    /**
     * Constructor
     */
    constructor()
    {
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath()
    {
        return __dirname;
    }

    /**
     * Configure service container
     *
     * @param   {Container}     container   Service container
     */
    *configureContainer(container)
    {
        container.addCompilerPass(new MiddlewareCompilerPass());
    }
}
