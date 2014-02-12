module.exports = {
    // Default port
    port: 1337,

    // The middlewares
    middlewares: [],

    // Configuration of the daemon
    daemon: {
        // PID file path
        pidPath: 'server.pid',

        // File path of the log
        logPath: null
    },

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

        // The command to stop the daemonized server
        'daemon-stop': {
            description: 'Stop the daemonized HTTP server',
            method: 'stopDaemon'
        },

        // The command to restart the daemonized server
        'daemon-restart': {
            description: 'Restart the daemonized HTTP server',
            method: 'restartDaemon'
        },

        // The command to check the status of the daemonized server
        'daemon-status': {
            description: 'Check the status of the daemonized HTTP server',
            method: 'checkDaemon'
        }

    }
};
