(function () {
   'use strict';

    var Workflow = require('./workflow');
    var ColorScheme = require('color-scheme');
    var logger = require('./logger');
    var ee = require('event-emitter');
    var q = require('q');

    var processing = [];
    var workflows = [];

    require('./link');
    require('./model');

    var $tabs = $('#tabs');//.tabs();
    var $tabContent = $tabs.children('.tab-content').first();
    var $tabsList = $tabs.children('#tabs-list');

    var emittable = ee({
        graphWorkflow: graphWorkflow,
        activate: activate,
        deactivate: deactivate
    });

    module.exports = emittable;

    function graphWorkflow(workflowDefinition, workflowId, workflowName) {
        var dfd = q.defer();

        processing.push(dfd);

        var workflowGraph = new Workflow(workflowDefinition);
        var Color = require('color');

        var graph = new joint.dia.Graph();
        var scheme = new ColorScheme();

        scheme.from_hue(20) 
            .scheme('analogic')
            .variation('pastel');

        var colors = scheme
            .colors();

        var paper = new joint.dia.Paper({
            width: 5000,
            height: 5000,
            gridSize: 1,
            model: graph,
            perpendicularLinks: true,
        });

        setGrid(paper, 10, '#0A0B11');

        var paperScroller = new joint.ui.PaperScroller({
            paper: paper,
            autoResizePaper: true
        });

        paperScroller.$el.css({
            width: $tabs.children('div').first().width(),
            height: $tabs.children('div').first().height()
        });

        // add a new tab with the paper
        //var $tab = $('<li role="presentation"><a role="tab" data-toggle="tab" href="#wf-' + workflowId + '">test</a></li>');
        //$tabsList.append($tab);
        var $content = $('<div>').addClass('paper');
        $tabsList.addBSTab('wf-' + workflowId, 'Test', $content);

        $content.append(paperScroller.render().el);

        paper.on('blank:pointerdown', paperScroller.startPanning);

        paper.on('cell:pointerdown', function(cellView, evt, x, y) { 
            if (cellView.model.attributes.node) {
                emittable.emit('stepClicked', cellView.model.attributes.node);
            }
        });

        (function () {
            var stepsSeen = [];
            var xOffset = 0;
            var yOffset = 0;
            var currentColumn = 0;
            var columns = [];

            // walks and adds each step in the workflow graph into an array
            // of columns to later be rejiggered and positioned.
            walkAndAdd(workflowGraph.getGraph(), 0);

            function walkAndAdd(node, col) {
                var rect = new joint.shapes.devs.Model2({ 
                    node: node,
                    position: { x: xOffset, y: yOffset },
                    size: { width: 200, height: 50 + (node.out.length * 20) },
                    inPorts: ['in'],
                    outPorts: node.out.map((n) => n.name),
                    attrs: {
                        '.label': {
                            text: node.name,
                            //'ref-x': .4,
                            'font-family': 'arial, helvetica, sans-serif',
                            'font-size': 12,
                            'fill': '#555'
                        },
                        '.body': {
                            rect: {
                                fill: '#EAEAEA',
                                stroke: '#222'
                            }
                        },
                        '.inPorts circle': { fill: 'rgb(230,178,126)', 'stroke-width': 0 },
                        '.outPorts circle': { fill: 'rgb(178,126,230)', 'stroke-width': 0 },
                        '.inPorts .port-label': {
                            'font-family': 'arial, helvetica, sans-serif',
                            'font-size': 10,
                            fill: '#555',
                            opacity: 0
                        },
                        '.outPorts .port-label': {
                            'font-family': 'arial, helvetica, sans-serif',
                            'font-size': 10,
                            fill: '#555'
                        }
                    }
                });

                if (typeof columns[col] === 'undefined') {
                    columns[col] = [];
                }
                columns[col].push(rect);
                node.rect = rect;
                //graph.addCells([rect]);
                //yOffset += 80;

                // if this step has more than one children, bump the X offset
                if (node.out && node.out.length > 1) {
                    //xOffset += 250;
                    //yOffset = 0;
                    col += 1;
                }

                // ignore circular references back to this step. we only want to add it to the graph once.
                stepsSeen.push(node.name);

                // process each child step
                (node.out || []).forEach((sub) => {
                    //var canLog = false;
                    //if (sub.name==='social-login') {
                    //    canLog  =true;
                    //    logger.log('hoping to add ' + sub.name + '..................');
                    //    logger.log('parent:', node.name);
                    //}
                    // can ANOTHER sibling reach the node I'm about to add?
                    // Bounce it out one column if another sibling can reach the node I'm about to add.
                    var canAdd = (node.out || [])
                        .filter((n) => n.name !== sub.name)
                        .every((sibling) => {
                            //if (canLog) {
                            //    logger.log('can ' + sibling.name + ' go to it?' + canReachNode(sibling, sub));
                            //}
                            var seenDuringReachWalk = [];
                            var canReach = canReachNode(sibling, sub, seenDuringReachWalk);
                            return (!canReach || (canReach && seenDuringReachWalk.indexOf(sub.name) > -1));
                        });

                    // only those who we've not already added to the graph
                    if (stepsSeen.indexOf(sub.name) === -1 && canAdd) {
                        walkAndAdd(sub, col);
                    }
                });

            }

            // add all steps from the column arrays to the paper
            for (var col = 0; col < columns.length; col++ ){
                var currentY = 40;
                for (var row = 0; row < columns[col].length; row++) {
                    var rect = columns[col][row];
                    rect.attributes.position = { x: 100 + (col * 430), y: currentY };
                    logger.log('adding rect', rect);
                    graph.addCells([rect]);
                    currentY += rect.attributes.size.height + 60;
                }
            }

            // create links
            Object.keys(workflowDefinition).forEach((stepName) => {
                var current = findStepInGraph(workflowGraph.getGraph(), stepName);
                logger.log('found ' + stepName + '?', current);
                if (current) {
                    var currentPortNumber = 0;
                    (current.out || []).forEach((dest) => {
                        logger.log('linking ' + current.name + ' to ' + dest.name);
                        var color = '#' + colors[Math.floor(Math.random() * colors.length)];

                        current.rect.attr('.outPorts>.port' + currentPortNumber +'>.port-body/fill', Color(color).lighten(0.3).hexString());
                        current.rect.attr('.outPorts>.port' + currentPortNumber + '>.port-body/stroke', Color(color).lighten(0).hexString());
                        dest.rect.attr('.inPorts>.port0>.port-body/fill', Color(color).lighten(0.3).hexString());
                        dest.rect.attr('.inPorts>.port0>.port-body/stroke', Color(color).lighten(0).hexString());
                        //dest.rect.attr('.inPorts>.port0>.port-body/fill', '#E7E7E7');
                        //dest.rect.attr('.inPorts>.port0>.port-body/stroke', '#B0B0B0');

                        var cell = new joint.shapes.org.Arrow2({
                            source: {id: current.rect.id, port: dest.name },
                            target: {id: dest.rect.id, port: 'in' },
                            router: { name: 'metro' },
                            connector: { name: 'rounded' },
                            attrs: {
                                '.connection': {
                                    'fill': 'none',
                                    'stroke-linejoin': 'round',
                                    'stroke-width': '2',
                                    //'stroke': 'rgb(126,230,230)'//'#999'
                                    'stroke': color
                                },
                                '.marker-target': {
                                    fill: color,
                                    'stroke-width': 0,
                                    d: 'M 10 0 L 0 5 L 10 10 z'
                                }
                            }

                        });
                        graph.addCell(cell);
                        currentPortNumber++;
                    });
                }
            });
            paperScroller.centerContent();
            paperScroller.zoomToFit();


            workflows.push({
                id: workflowId,
                graph: workflowGraph.getGraph()
            });

            dfd.resolve();
        })();
    }

    /**
     * Marks a step as activated
     */
    function activate(id, name) {
        q.all(processing).done(function () {
            console.log('activating ' + id + '#' + name);
            // find step node to activate
            var wf = findWorkflowInQueue(id);
            var step = findStepInGraph(wf.graph, name);

            step.rect.attr('.body/fill', '#bbffbb');
        });
    }

    /**
     * Deactivates a step
     */
    function deactivate(id, name) {
        q.all(processing).done(function () {
            console.log('deactivating ' + id + '#' + name);
            var wf = findWorkflowInQueue(id);
            var step = findStepInGraph(wf.graph, name);
            step.rect.attr('.body/fill', '#E0E0E0');

        });
    }

    function findWorkflowInQueue(workflowId) {
        var wf;

        workflows.some(function (w) {
            if (w.id === workflowId) {
                wf = w;
            }
        });

        return wf;
    }

    /**
     * Returns true if the ending node can be reached from the starting node
     * @param {object} startingNode
     * @param {object} endingNode
     * @param {Array} seen
     */
    function canReachNode(startingNode, endingNode, seen) {
        seen = seen || [];
        return walk(startingNode);
        function walk(node) {
            seen.push(node.name);
            return (node.out || []).some((child) => {
                if (seen.indexOf(child.name) === -1) {
                    return node.name === endingNode.name || walk(child);
                }
            });
        }
    }

    function findStepInGraph(startingNode, stepName) {
        var seen = [];
        return walk(startingNode);
        function walk(node) {
            var found;
            seen.push(node.name);
            if (node.name === stepName) {
                return node;
            }

            (node.out || []).forEach((child) => {
                if (seen.indexOf(child.name) === -1) {
                    found = found || walk(child);
                }
            });

            return found;
        }
    }

    function setGrid(paper, gridSize, color) {
        // Set grid size on the JointJS paper object (joint.dia.Paper instance)
        paper.options.gridSize = gridSize;
        // Draw a grid into the HTML 5 canvas and convert it to a data URI image
        var canvas = $('<canvas/>', { width: gridSize, height: gridSize });
        canvas[0].width = gridSize;
        canvas[0].height = gridSize;
        var context = canvas[0].getContext('2d');
        context.beginPath();
        context.rect(1, 1, 1, 1);
        context.fillStyle = color || '#AAAAAA';
        context.fill();
        // Finally, set the grid background image of the paper container element.
        var gridBackgroundImage = canvas[0].toDataURL('image/png');
        paper.$el.css('background-image', 'url("' + gridBackgroundImage + '")');
    }
})();
