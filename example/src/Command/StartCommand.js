/* @flow */
import type {CommandInterface} from "solfegejs-cli/interface"
import ContainerAwareCommand from "solfegejs-cli/lib/Command/ContainerAwareCommand"

/**
 * Start command
 */
export default class StartCommand extends ContainerAwareCommand implements CommandInterface
{
    /**
     * Configure command
     */
    *configure():Generator<*,*,*>
    {
        this.setName("example:start");
        this.setDescription("Start example");
    }

    /**
     * Execute the command
     */
    *execute():Generator<*,*,*>
    {
        let container = this.getContainer();
        let serverFactory = yield container.get("http_server_factory");

        let defaultServer = serverFactory.create();
        let secondaryServer = serverFactory.create("secondary");
        defaultServer.start(8080);
        secondaryServer.start(8081);

        console.info("Example started");
    }
}
