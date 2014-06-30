
var fileServer = require('./servers/FileServer');
fileServer.listen(80);

var OctreeController = require('./controllers/OctreeController');
var SocketController = require('./servers/SocketServer');
var ClientController = require('./controllers/ClientController');

var octreeController = new OctreeController(new SocketController(fileServer, function (socket) {
    var clientController = new ClientController(socket);
    clientController.Reemit('insertValue', octreeController);
    clientController.Reemit('query', octreeController);

    octreeController.emit('newClient', socket);
}));
