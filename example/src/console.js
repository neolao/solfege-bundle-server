import Application from "solfegejs-application"
import DIBundle from "solfegejs-dependency-injection"
import CLIBundle from "solfegejs-cli"
import ServerBundle from "../../lib/Bundle"
import MyBundle from "./Bundle"

// Create application instance
let application = new Application;
application.addBundle(new DIBundle);
application.addBundle(new CLIBundle);
application.addBundle(new ServerBundle);
application.addBundle(new MyBundle);

// Start the application
let parameters = process.argv.slice(2);
application.start(parameters);
