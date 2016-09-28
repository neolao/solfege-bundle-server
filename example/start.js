const solfege = require("solfegejs");
const ServerBundle = require("../lib/Bundle");
const MyBundle = require("./lib/Bundle");

let application = solfege.factory();
application.addBundle(new ServerBundle);
application.addBundle(new MyBundle);

application.start(["example:start"]);
