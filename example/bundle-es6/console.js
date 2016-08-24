import solfege from "solfegejs";
import ServerBundle from "../../lib/Bundle";
import MyBundle from "./MyBundle";

let application = solfege.factory();
application.addBundle(new ServerBundle);
application.addBundle(new MyBundle);

let parameters = process.argv;
parameters.shift();
parameters.shift();
application.start(parameters);
