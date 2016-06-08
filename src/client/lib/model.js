joint.shapes.devs.Model2 = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="container"><rect class="body scalable"/><g class="inPorts"/><g class="outPorts"/><rect class="header"/><text class="label"/></g>',
        //markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><rect class="header"/><text class="label"/><g class="ports-container"><g class="inPorts"/><g class="outPorts"/></g></g>',
        //portMarkup: '<g class="port port<%= id %>"><circle class="port-body"/><text class="port-label"/></g>',
        portMarkup: '<g class="port port<%= id %>"><rect class="port-body"/><text class="port-label"/></g>',
        defaults: joint.util.deepSupplement({
            type: "devs.Model",
            size: {
                width: 1,
                height: 1
            },
            inPorts: [],
            outPorts: [],
            attrs: {
                ".": {
                    magnet: !1
                },
                ".body": {
                    width: 180,
                    height: 250,
                    y: 45,
                    fill: '#E0E0E0'
                },
                ".header": {
                    width: 200,
                    height: 35,
                    fill: '#D0D0D0'
                },
                ".ports-container": {
                    y: 50
                },
                ".port-body": {
                    r: 10,
                    magnet: !0,
                    //stroke: "#999",
                    width: 15,
                    height: 10
                },
                ".outPorts .port-body": {
                    x: -11
                },
                ".inPorts .port-body": {
                    x: -4
                },
                ".inPorts": {
                    y: 25
                },
                ".outPorts": {
                    y: 25
                },
                ".inPorts .port-label": {
                    opacity: 0
                },
                text: {
                    "pointer-events": "none"
                },
                ".label": {
                    text: "Model",
                    "ref-x": .5,
                    "ref-y": 0.3,
                    ref: ".header",
                    "text-anchor": "middle",
                    fill: "#000000"
                },
                ".inPorts .port-label": {
                    x: -15,
                    dy: 4,
                    "text-anchor": "end",
                    fill: "#000000"
                },
                ".outPorts .port-label": {
                    x: 15,
                    dy: 4,
                    fill: "#000000",
                    ref: ".body",
                    x: -15,
                    "text-anchor": "end"
                }
            }
        }, joint.shapes.basic.Generic.prototype.defaults),
        getPortAttrs: function(a, b, c, d, e) {
            var f = {},
                g = "port" + b,
                h = d + ">." + g,
                i = h + ">.port-label",
                j = h + ">.port-body";
            return f[i] = {
                text: a
            }, f[j] = {
                port: {
                    id: a || _.uniqueId(e),
                    type: e
                }
            }, f[h] = {
                ref: ".body",
                "ref-y": (b + .5) * (1 / c)
            }, ".outPorts" === d && (f[h]["ref-dx"] = 0), f
        }
}));