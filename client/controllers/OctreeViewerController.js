
var OctreeViewerController = function ($rootScope, OctreeFactory) {
    setCanvasSize($rootScope);

    OctreeFactory.init();

    monitorScreenSize($rootScope, OctreeFactory, 25);

    var socket = io('http://' + $rootScope.hostname);

    listenToButtons($rootScope, socket);
    listenToSocketEvents($rootScope, socket);
    startQueryLoop(socket, 100);
};

function setCanvasSize($rootScope) {
    $rootScope.canvasHeight = window.innerHeight - 36;
    $rootScope.canvasWidth = $("#viewerContainer").width();
}

function monitorScreenSize($rootScope, OctreeFactory, delay) {
    setInterval(function () {
        setCanvasSize($rootScope);
        OctreeFactory.reorient();
    }, delay);
}

function listenToButtons($rootScope, socket) {
    $rootScope.$on('insertValue', function (event, x, y, z) {
        var valueBox = new BoxModel(new PointModel(x, y, z), 1, 1, 1);
        console.log("Attempting value insert at: ", valueBox.Center);
        socket.once('valueInserted', function (value) {
            console.log("Value inserted at: ", value.BoundingBox.Center);
        });
        socket.emit('newId', function (id) {
            socket.emit('insertValue', new OctreeValueModel(id, {
                my: "value"
            }, valueBox));
        });
    });
}

function listenToSocketEvents($rootScope, socket) {
    emitOnRootScope('values', $rootScope, socket);
    emitOnRootScope('leaves', $rootScope, socket);
}

function emitOnRootScope(eventName, $rootScope, socket) {
    socket.on(eventName, function () {
        $rootScope.$emit.apply($rootScope, ([ eventName ]).concat(_.toArray(arguments)));
    });
}

function startQueryLoop(socket, delay) {
    setInterval(function () {
        socket.emit('query');
    }, delay);
}
