import solfege from "solfegejs";
let Application = solfege.kernel.Application;

export default class MyBundle
{
    constructor()
    {
    }

    *setApplication(application:Application)
    {
        let bindGenerator = solfege.util.Function.bindGenerator;
        this.application = application;
        this.application.on(solfege.kernel.Application.EVENT_START, bindGenerator(this, this.onApplicationStart));
    }

    *onApplicationStart()
    {
        let server = this.application.getBundle("http");
        yield server.start();
    }
}

