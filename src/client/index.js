(function () {
    'use strict';

    var grapher = require('./lib/grapher');
    var workflowName = document.location.hash || 'login';
    var modal = require('./lib/modal');
    var io = require('socket.io-client');

    var socket = io('https://localhost:8443/', { secure: true });

    var globalWorkflowDefinition = {};
    window.get = function () {
        return globalWorkflowDefinition;
    };

    socket.on('connect', function () {
        console.log('connected');

        socket.on('workflow.start', function (data) {
            console.log("got workflow.start", data);

            var workflowDefinition = globalWorkflowDefinition[data.name];
            grapher.graphWorkflow(workflowDefinition, data.workflowId, data.name);
        });

        socket.on('step.start', function (data) {
            console.log('got step.start');
            grapher.activate(data.workflowId, data.name, data.data);
        });

        socket.on('step.end', function (data) {
            console.log('got step.end');
            grapher.deactivate(data.workflowId, data.name, data.data);
        });

        socket.on('workflow.register', function (data) {
            console.log('workflow registered', data);
            globalWorkflowDefinition[data.name] = {};
        });

        socket.on('step.register', function (data) {
            console.log('step registered', data);
            globalWorkflowDefinition[data.workflowName][data.stepName] = {
                callbacks: {
                    success: [],
                    failure: [],
                    cancel: []
                }
            };
        });

        socket.on('step.out.register', function (data) {
            console.log('step out registered', data);
            data.returnValues.forEach(function (rv) {
                globalWorkflowDefinition[data.workflowName][data.stepName].callbacks[data.result].push({
                    value: rv,
                    condition: null
                });
            })
        });
    });

    grapher.on('stepClicked', function (step) {
        modal.show(step);
    });
})();