(function () {
    'use strict';

    module.exports = function Workflow(def) {
        var definition = def;

        buildGraph(definition);

        return {
            getGraph: getGraph
        };

        /**
         * Gets the workflow graph
         * @returns {object} graph
         */
        function getGraph() {
            return {};
        }
    };

    /**
     * Builds a graph from the workflow definition
     * @param {object} definition Workflow definition object
     */
    function buildGraph(definition) {
        debugger;
        var rootStepName = findRootStepName(definition, 'prompt');
        debugger;
    }

    /**
     * Finds the root node within a workflow definition
     * @param {object} definition Workflow definition object
     * @param {string} current Current step name
     */
    function findRootStepName(definition, current) {
        var stepKeys = Object.keys(definition);
        var currentStepName = current || stepKeys[0];
        var parent;

        // don't get stuck in a loop when encountering circular references
        definition[currentStepName].$seen = true;

        // current is the root if the only steps that link to it have already been "seen"
        // assume the current step is the root unless we find reasons to believe otherwise.
        var isRoot = stepKeys.every(function (enumeratedStepName) {
            var callbacks = definition[enumeratedStepName].callbacks;
            var outSteps = (callbacks.success || []).concat(callbacks.failure || []).concat(callbacks.cancel || []);
            var foundLinks = false;
            var matches = outSteps
                .map((s) => s.value)
                .every(function (outStepName) {
                    parent = (!definition[enumeratedStepName].$seen ? enumeratedStepName : parent);
                    return !(outStepName === currentStepName && !definition[enumeratedStepName].$seen);
                });

            console.log(matches);
            return matches;
        });

        return isRoot ? definition[currentStepName] : findRootStepName(definition, parent);
    }
})();
