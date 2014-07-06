
var fileServer = new (require('node-static')).Server('../OctreeViewer/');
var http = require('http');
var server = http.createServer(function (request, response) {
    var requestRoot = request.url.substring(1, request.url.substring(1).indexOf('/') + 1);
    var requestExt = request.url.substring(request.url.length - 4);
    requestExt = requestExt.substring(requestExt.indexOf('.'));
    if (requestRoot === '/' && requestExt === '/') {
        request.url = '/client/index.html';
    }
    else if (requestRoot !== 'node_modules' && requestRoot !== 'infrastructure') {
        request.url = '/client' + request.url;
    }
    request.addListener('end', function () {
        fileServer.serve(request, response, function (e) {
            if (e && (e.status === 404 && requestExt !== ".map" && requestExt !== ".ico")) {
                e.url = request.url;
                console.log(e);
                fileServer.serveFile('/client/404.html', 404, {}, request, response);
            }
        });
    }).resume();
});

console.log("Server up at 'http://" + require('octree').helpers.ip.GetLocalIp() + ":8080'");

module.exports = server;
