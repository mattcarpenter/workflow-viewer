(function () {
   'use strict';

    var Workflow = require('./lib/workflow');
    var ColorScheme = require('color-scheme');
    var workflowDefinition = require('./sample.js')['register-subflow'];
    var workflowGraph = new Workflow(workflowDefinition);
    require('./lib/link');
    require('./lib/model');
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

    var paperScroller = new joint.ui.PaperScroller({
        paper: paper,
        autoResizePaper: true
    });

    paperScroller.$el.css({
        width: $(window).width(),
        height: $(window).height()
    });

    $('#paper').append(paperScroller.render().el);

    paper.on('blank:pointerdown', paperScroller.startPanning);

    (function () {
        var stepsSeen = [];
        var xOffset = 0;
        var yOffset = 0;
        var currentColumn = 0;
        var columns = [];

        walkAndAdd(workflowGraph.getGraph(), 0);

        function walkAndAdd(node, col) {
            var rect = new joint.shapes.devs.Model2({ 
                position: { x: xOffset, y: yOffset },
                size: { width: 150, height: 50 + (node.out.length * 20) },
                inPorts: ['in'],
                outPorts: node.out.map((n) => n.name),
                attrs: {
                    '.label': {
                        text: node.name,
                        //'ref-x': .4,
                        'ref-y': -13,
                        'font-family': 'arial, helvetica, sans-serif',
                        'font-size': 12,
                        'fill': '#FFFFFF'
                    },
                    rect: {
                        fill: '#F6F6F7',
                        stroke: '#555'
                    },
                    '.inPorts circle': { fill: 'rgb(230,178,126)', 'stroke-width': 0 },
                    '.outPorts circle': { fill: 'rgb(178,126,230)', 'stroke-width': 0 },
                    '.inPorts .port-label': {
                        'font-family': 'arial, helvetica, sans-serif',
                        'font-size': 10,
                        x: 25,
                        fill: '#555'
                    },
                    '.outPorts .port-label': {
                        'font-family': 'arial, helvetica, sans-serif',
                        'font-size': 10,
                        x: -100,
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
                //    console.log('hoping to add ' + sub.name + '..................');
                //    console.log('parent:', node.name);
                //}
                // can ANOTHER sibling reach the node I'm about to add?
                // Bounce it out one column if another sibling can reach the node I'm about to add.
                var canAdd = (node.out || [])
                    .filter((n) => n.name !== sub.name)
                    .every((sibling) => {
                        //if (canLog) {
                        //    console.log('can ' + sibling.name + ' go to it?' + canReachNode(sibling, sub));
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

        // add everything to the graph
        for (var col = 0; col < columns.length; col++ ){
            var currentY = 20;
            for (var row = 0; row < columns[col].length; row++) {
                var rect = columns[col][row];
                rect.attributes.position = { x: 100 + (col * 400), y: currentY };
                console.log('adding rect', rect);
                graph.addCells([rect]);
                currentY += rect.attributes.size.height + 35;
            }
        }

        // create links
        Object.keys(workflowDefinition).forEach((stepName) => {
            var current = findStepInGraph(workflowGraph.getGraph(), stepName);
            console.log('found ' + stepName + '?', current);
            if (current) {
                var currentPortNumber = 0;
                (current.out || []).forEach((dest) => {
                    console.log('linking ' + current.name + ' to ' + dest.name);
                    var color = '#' + colors[Math.floor(Math.random() * colors.length)];
                    debugger;
                    current.rect.attr('.outPorts>.port' + currentPortNumber +'>.port-body/fill', color);
                    dest.rect.attr('.outPorts>.port0>.port-body/fill', '#000000');
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
    })();

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
})();
