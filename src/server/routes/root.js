module.exports = function rootHandler (request, reply) {
    reply.view('index', {
        title: 'Workflow Viewer'
    });
};
