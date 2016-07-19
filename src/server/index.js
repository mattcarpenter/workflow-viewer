'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const parser = require('./lib/parser');

server.connection({ port: 8000 });
var io = require('socket.io')(server.listener);

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

    io.on('connection', function (socket) {
        console.log('connection');
        
        socket.on('workflow.start', function (data) {
            console.log('relaying workflow.start');
            socket.broadcast.emit('workflow.start', data);
        });

        socket.on('workflow.end', function (data) {
            console.log('relaying workflow.end');

            socket.broadcast.emit('workflow.end', data);
        });

        socket.on('step.start', function (data) {
            console.log('relaying step.start', data);
            socket.broadcast.emit('step.start', data);
        });

        socket.on('step.end', function (data) {
            console.log('relaying step.end', data);

            socket.broadcast.emit('step.end', data);
        });

        socket.on('workflow.register', function (data) {
            console.log('relaying workflow.register');

            socket.broadcast.emit('workflow.register', data);
        });

        socket.on('step.register', function (data) {
            console.log('relaying step.register');

            socket.broadcast.emit('step.register', data);
        });

        socket.on('step.out.register', function (data) {
            if ((data.cb || '').indexOf('function') === 0) {
                // Esprima blows up if the function is not named
                data.cb = data.cb.replace(/^function/, 'function cb');
                // obtain all possible literal return values from this function
                data.returnValues = parser.parseReturnValues(data.cb);
            } else {
                data.returnValues = [data.cb];
            }
            socket.broadcast.emit('step.out.register', data);
        });
    });

    server.start((err) => {
        if (err) {
            throw err;
        }

        console.log('Server running at:', server.info.uri);
    });
});