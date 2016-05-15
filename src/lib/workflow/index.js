(function () {
    'use strict';

    module.exports = function Workflow(def) {
        var definition = def;

        var root = buildGraph(definition);

        return {
            getGraph: getGraph
        };

        /**
         * Gets the workflow graph
         * @returns {object} graph
         */
        function getGraph() {
            return root;
        }
    };

    /**
     * Builds a graph from the workflow definition
     * @param {object} definition Workflow definition object
     * @param {object} current Current step name
     */
    function buildGraph(definition, current) {
        var root = findRootStepName(definition);
        root.out = getOutboundConnections(root);

        function getOutboundConnections(currentNode) {
            var outStepNames = getOutStepNames(currentNode);
            var result = [];

            currentNode.$flagged = true;
            // each out step also needs their 'out' set
            outStepNames.forEach((outStepName) => {
                var outStep = definition[outStepName];

                // outStep will be undefined if outStepName is a built-in value such as `done`
                if (outStep) {
                    outStep.name = outStepName;
                    if (outStep.$flagged) {
                        result.push(outStep);
                    } else {
                        outStep.out = getOutboundConnections(outStep);
                        result.push(outStep);
                    }
                }
            });

            return result;
        }

        return root;
    }

    /**
     * Finds the root node within a workflow definition using recursion
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
        var isRoot = stepKeys.every((enumeratedStepName) => {
            return getOutStepNames(definition[enumeratedStepName])
                .every((outStepName) => {
                    parent = (!definition[enumeratedStepName].$seen ? enumeratedStepName : parent);
                    return !(outStepName === currentStepName && !definition[enumeratedStepName].$seen);
                });
        });

        if (isRoot) {
            definition[currentStepName].name = currentStepName;
        }

        return isRoot ? definition[currentStepName] : findRootStepName(definition, parent);
    }

    /**
     * Gets the names of all steps
     * @param stepDefinition step object from the workflow definition
     * @returns {Array}
     */
    function getOutStepNames(stepDefinition) {
        var callbacks = stepDefinition.callbacks;
        return (callbacks.success || []).concat(callbacks.failure || []).concat(callbacks.cancel || [])
            .map((s) => s.value)
            .filter((v) => v)
    }
})();
