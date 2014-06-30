
module.exports = function (httpServer, callback) {
    var io = require('socket.io')(httpServer);
    io.on('connection', function (socket) {
        callback(socket);
    });
    return io;
};
