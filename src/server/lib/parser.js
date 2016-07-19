var esprima = require('esprima');
var utils = require('esprima-ast-utils');

module.exports = {
    parseReturnValues: parseReturnValues
};

function parseReturnValues(src) {

    var values = [];
    var syntax = esprima.parse(src);
    
    utils.traverse(syntax, function (node, parent) {
        if (node.type === 'ReturnStatement') {
            values = values.concat(evaluate(syntax, node.argument));
        }
    });

    return values;
}

/**
 * Attempts to resolve the following node to a value
 */
function evaluate(rootNode, node) {
    var values = [];
    node = node || rootNode;

    // Looking for an identifier?
    if (node.type === 'Identifier' && typeof node.name === 'string') {
        var declaration = findVariableDeclaration(rootNode, node.name);

        if (declaration.init && declaration.init.type === 'Literal') {
            // Is the identifier a declared variable with a literal value?
            values.push(declaration.init.value);
        } else if (declaration && declaration.init.type === 'LogicalExpression') {
            // Is the identifier a declared variable with a value from a logical expression?
            values = values.concat(evaluate(rootNode, declaration.init));
        }
    }

    // Evaluating a logical expression with two possible values?
    if (node.type === 'LogicalExpression' && node.operator === '||') {
        // Evaulate the left and right sides
        values = values.concat(evaluate(rootNode, node.left));
        values = values.concat(evaluate(rootNode, node.right));
    }

    // If node is a literal, simply return the value
    if (node.type === 'Literal') {
        values.push(node.value);
    }

    // Member expressions are tricky. This means one of the identifiers we're looking for was
    // assigned the value from a member expression. We need to identify what possible values
    // we could obtain from that object regardless of what key was used to access them.
    if (node.type === 'MemberExpression') {
        node.object.properties.forEach(function (property) {
            if (property.value.type === 'Literal') {
                values.push(property.value.value);
            }
        });
    }

    return values;
}

function findVariableDeclaration(root, name) {
    var ret;

    utils.traverse(root, function (node, parent) {
        // Looking for a single variable
        if (node.type === 'VariableDeclarator'
            && node.id
            && node.id.name == name) {
            ret = node;
        }
    });

    return ret;
}
