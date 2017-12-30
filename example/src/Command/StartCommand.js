/* @flow */
import type {CommandInterface} from "solfegejs-cli/interface"
import AbstractCommand from "solfegejs-cli/lib/Command/AbstractCommand"
import type ServerFactory from "../../../src/ServerFactory"

/**
 * Start command
 */
export default class StartCommand extends AbstractCommand implements CommandInterface
{
    /**
     * Server factory
     */
    serverFactory:ServerFactory;

    /**
     * Constructor
     */
    constructor(serverFactory:ServerFactory)
    {
        super();

        this.serverFactory = serverFactory;
    }

    /**
     * Configure command
     */
    async configure()
    {
        this.setName("example:start");
        this.setDescription("Start example");
    }

    /**
     * Execute the command
     */
    async execute()
    {
        let defaultServer = this.serverFactory.create("default", 8080, () => {
            console.log("hit");
        });
        defaultServer.start();

        console.info("Example started");
    }
}
