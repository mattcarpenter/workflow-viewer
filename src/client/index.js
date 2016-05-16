(function () {
    'use strict';

    var Workflow = require('../lib/workflow');

    var workflowDefinition = require('./sample.js').login;
    var workflowGraph = new Workflow(workflowDefinition);
    var graph = new joint.dia.Graph();

    var paper = new joint.dia.Paper({
        el: $('#paper'),
        width: $(window).width() + 600,
        height: $(window).height(),
        gridSize: 1,
        model: graph,
        perpendicularLinks: true,
        restrictTranslate: true
    });

    (function () {
        var stepsSeen = [];
        var xOffset = 0;
        var yOffset = 0;

        walkAndAdd(workflowGraph.getGraph());

        function walkAndAdd(node) {
            // add this to the graph
            var rect = new joint.shapes.basic.Rect({
                position: { x: xOffset, y: yOffset },
                size: { width: 150, height: 50 },
                attrs: {
                    rect: {
                        stroke: '#444',
                        'stroke-width': 2
                    },
                    text: {
                        text: node.name,
                        fill: '#000',
                        'font-size': 12
                    }
                }
            });

            graph.addCells([rect]);
            yOffset += 80;

            // if this step has more than one children, bump the X offset
            if (node.out && node.out.length > 1) {
                xOffset += 250;
                yOffset = 0;
            }

            // ignore circular references back to this step. we only want to add it to the graph once.
            stepsSeen.push(node.name);

            // process each child step
            (node.out || []).forEach((sub) => {
                var canLog = false;
                if (sub.name==='create-session') {

                    canLog =true;
                    console.log('hoping to add ' + sub.name + '..................');
                    console.log('parent:', node.name);
                }
                // can ANOTHER sibling reach the node I'm about to add?
                // Bounce it out one column if another sibling can reach the node I'm about to add.
                var canReach = (node.out || [])
                    .filter((n) => n.name !== sub.name)
                    .some((sibling) => {
                        if (canLog)
                            console.log('can ' + sibling.name + ' go to it?' + canReachNode(sibling, sub));
                        return canReachNode(sibling, sub);
                    });


                // only those who we've not already added to the graph
                if (stepsSeen.indexOf(sub.name) === -1 ) {
                    walkAndAdd(sub);
                }
            });

        }
    })();

    /**
     * Returns true if the ending node can be reached from the starting node
     * @param startingNode
     * @param endingNode
     */
    function canReachNode(startingNode, endingNode) {
        var seen = [];
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


    /*
    var member = function (x, y, rank, name, image, background, textColor) {

        textColor = textColor || "#000";

        var cell = new joint.shapes.org.Member({
            position: {x: x, y: y},
            attrs: {
                '.card': {fill: background, stroke: 'none'},
                image: {'xlink:href': '/images/demos/orgchart/' + image, opacity: 0.7},
                '.rank': {text: rank, fill: textColor, 'word-spacing': '-5px', 'letter-spacing': 0},
                '.name': {text: name, fill: textColor, 'font-size': 13, 'font-family': 'Arial', 'letter-spacing': 0}
            }
        });
        graph.addCell(cell);
        return cell;
    };

    function link(source, target, breakpoints) {

        var cell = new joint.shapes.org.Arrow({
            source: {id: source.id},
            target: {id: target.id},
            vertices: breakpoints,
            attrs: {
                '.connection': {
                    'fill': 'none',
                    'stroke-linejoin': 'round',
                    'stroke-width': '2',
                    'stroke': '#4b4a67'
                }
            }

        });
        graph.addCell(cell);
        return cell;
    }

    var bart = member(300, 70, 'CEO', 'Bart Simpson', 'male.png', '#30d0c6');
    var homer = member(90, 200, 'VP Marketing', 'Homer Simpson', 'male.png', '#7c68fd', '#f1f1f1');
    var marge = member(300, 200, 'VP Sales', 'Marge Simpson', 'female.png', '#7c68fd', '#f1f1f1');
    var lisa = member(500, 200, 'VP Production', 'Lisa Simpson', 'female.png', '#7c68fd', '#f1f1f1');
    var maggie = member(400, 350, 'Manager', 'Maggie Simpson', 'female.png', '#feb563');
    var lenny = member(190, 350, 'Manager', 'Lenny Leonard', 'male.png', '#feb563');
    var carl = member(190, 500, 'Manager', 'Carl Carlson', 'male.png', '#feb563');


    link(bart, marge, [{x: 385, y: 180}]);
    link(bart, homer, [{x: 385, y: 180}, {x: 175, y: 180}]);
    link(bart, lisa, [{x: 385, y: 180}, {x: 585, y: 180}]);
    link(homer, lenny, [{x: 175, y: 380}]);
    link(homer, carl, [{x: 175, y: 530}]);
    link(marge, maggie, [{x: 385, y: 380}]);
    */
})();
