(function () {
    'use strict';

    var grapher = require('./lib/grapher');
    var workflowName = document.location.hash || 'login';
    var workflowDefinition = require('./sample.js')[workflowName];
    var modal = require('./lib/modal');
    var io = require('socket.io-client');

    var socket = io('https://localhost:8443/', { secure: true });

    socket.on('connect', function () {
        console.log('connected');

        socket.on('workflow.start', function (data) {
            console.log("got workflow.start", data);

            // @todo: why toLowerCase()/
            var workflowDefinition = require('./sample.js')[data.name.toLowerCase()];
            grapher.graphWorkflow(workflowDefinition, data.workflowId, data.name);
        });

        socket.on('step.start', function (data) {
            console.log('got step.start');
            grapher.activate(data.workflowId, data.name);
        });

        socket.on('step.end', function (data) {
            console.log('got step.end');
            grapher.deactivate(data.workflowId, data.name);
        });
    });

    grapher.on('stepClicked', function (step) {
        modal.show(step);
    });
})();