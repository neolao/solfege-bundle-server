import solfege from "solfegejs";
import ServerBundle from "../../lib/Bundle";
import MyBundle from "./Bundle";

let application = solfege.factory();
application.addBundle(new ServerBundle);
application.addBundle(new MyBundle);

application.start(["example:start"]);
