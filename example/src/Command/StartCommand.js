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
        let secondaryServer = serverFactory.create("secondary", 8081);
        defaultServer.start();
        secondaryServer.start();

        console.info("Example started");
    }
}
