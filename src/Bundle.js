/* @flow */
import MiddlewareCompilerPass from "./DependencyInjection/Compiler/MiddlewareCompilerPass"
import type {BundleInterface} from "solfegejs-application/src/BundleInterface"
import type {ContainerInterface} from "solfegejs-dependency-injection/interface"

/**
 * Server bundle
 */
export default class Bundle implements BundleInterface
{
    /**
     * Constructor
     */
    constructor():void
    {
    }

    /**
     * Get bundle path
     *
     * @return  {string}        The bundle path
     */
    getPath():string
    {
        return __dirname;
    }

    /**
     * Configure service container
     *
     * @param   {Container}     container   Service container
     */
    configureContainer(container:ContainerInterface)
    {
        container.addCompilerPass(new MiddlewareCompilerPass());
    }
}
