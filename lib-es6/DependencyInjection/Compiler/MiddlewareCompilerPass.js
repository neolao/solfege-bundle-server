/**
 * Compiler pass for the service container
 * It handles tags to register server middlewares
 */
export default class MiddlewareCompilerPass
{
    /**
     * Process the tags
     *
     * @param   {Container}     container   Service container
     */
    *process(container)
    {
        let factoryDefinition = container.getDefinition("http_server_factory");

        let serviceIds = container.findTaggedServiceIds("http_server_middleware");
        for (let serviceId of serviceIds) {
            let middlewareReference = container.getReference(serviceId);
            let middlewareDefinition = container.getDefinition(serviceId);
            let middlewareTags = middlewareDefinition.getTags();

            for (let middlewareTag of middlewareTags) {
                if (middlewareTag.name !== "http_server_middleware") {
                    continue;
                }

                let serverName = "default";
                let priority = 0;
                if (middlewareTag.server_name) {
                    serverName = middlewareTag.server_name;
                }
                if (middlewareTag.priority) {
                    priority = middlewareTag.priority;
                }
                factoryDefinition.addMethodCall("addMiddleware", [
                    serverName, 
                    middlewareReference,
                    priority
                ]);
            }

        }
    }
}
