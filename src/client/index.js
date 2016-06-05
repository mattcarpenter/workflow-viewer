(function () {
    'use strict';

    var grapher = require('./lib/grapher');
    var workflowDefinition = require('./sample.js')['register-subflow'];

    grapher.graphWorkflow(workflowDefinition);
})();