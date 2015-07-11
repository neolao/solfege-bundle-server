import solfege from "solfegejs";
import server from "../../bundle";
import MyBundle from "./MyBundle";

let application = new solfege.kernel.Application(__dirname);
application.addBundle('http', new server.HttpServer);
application.addBundle('myBundle', new MyBundle);


application.start();

