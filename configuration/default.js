module.exports = {
    // Default port
    port: 1337,

    // The middlewares
    middlewares: [],

    // Command line interface
    // Used by the bundle solfege.bundle.cli
    cli: {
        // The command to start the server
        start: {
            description: 'Start the HTTP server',
            method: 'start'
        },

        // The command to start the daemonized server
        'daemon-start': {
            description: 'Start the daemonized HTTP server',
            method: 'startDaemon'
        },

        // The command to check the status of the daemonized server
        'daemon-status': {
            description: 'Check the status of the daemonized HTTP server',
            method: 'checkDaemon'
        }

    }
};
