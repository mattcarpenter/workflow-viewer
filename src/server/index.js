'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({ port: 8000 });

server.register([
        require('vision'),
        require('inert')
    ], (err) => {

    if (err) {
        throw err;
    }

    // Configure for Jade templates
    server.views({
        engines: { jade: require('jade') },
        path: __dirname + '/views',
        compileOptions: {
            pretty: true
        }
    });

    // Serve static files from public
    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: __dirname + '/../../public/'
            }
        }
    });

    server.route({ method: 'GET', path: '/', handler: require('./routes/root') });

    server.start((err) => {
        if (err) {
            throw err;
        }

        console.log('Server running at:', server.info.uri);
    });
});