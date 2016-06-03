joint.shapes.devs.Model2 = joint.shapes.basic.Generic.extend(_.extend({}, joint.shapes.basic.PortsModelInterface, {
        markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',
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
                    width: 150,
                    height: 250,
                    stroke: "#000000"
                },
                ".port-body": {
                    r: 10,
                    magnet: !0,
                    stroke: "#000000",
                    width: 15,
                    height: 10
                },
                ".outPorts .port-body": {
                    x: -15,
                    stroke: "#FF0000"
                },
                text: {
                    "pointer-events": "none"
                },
                ".label": {
                    text: "Model",
                    "ref-x": .5,
                    "ref-y": 10,
                    ref: ".body",
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
                    fill: "#000000"
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