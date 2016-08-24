import solfege from "solfegejs";
import Application from "solfegejs/lib/kernel/Application";
import {bindGenerator, isGenerator} from "solfegejs/lib/utils/GeneratorUtil";

export default class MyBundle
{
    constructor()
    {
        this.application;
        this.container;
    }

    /**
     * Get bundle path
     *
     * @return  {String}        The bundle path
     */
    getPath()
    {
        return __dirname;
    }


    /**
     * Initialize the bundle
     *
     * @param   {solfegejs/kernel/Application}  application     Solfege application
     */
    *initialize(application)
    {
        this.application = application;

        // Listen the application start
        this.application.on(Application.EVENT_START, bindGenerator(this, this.onStart));
    }

    *configureContainer(container)
    {
        this.container = container;
    }

    *onStart()
    {
        let serverFactory = yield this.container.get("http_server_factory");
        let server = serverFactory.create();
        server.start(8080, (request, response) => {
            console.log("ok");
        });
    }
}

