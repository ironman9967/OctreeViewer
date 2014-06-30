
var fileServer = new (require('node-static')).Server('../');

module.exports = require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        fileServer.serve(request, response, function (e) {
            var ext = request.url.substring(request.url.length - 4);
            if (e && (e.status === 404 && ext !== ".map" && ext !== ".ico")) {
                console.log(e, "URL: " + request.url);
                fileServer.serveFile('/OctreeViewerAngular/404.html', 404, {}, request, response);
            }
        });
    }).resume();
});
