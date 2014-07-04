
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

var x = 3;
var y = 3;
var z = 3;

function listenToButtons($rootScope, socket) {
    $rootScope.$on('insertValue', function () {
        socket.emit('insertValue', new OctreeValueModel(JSON.stringify({
            my: "value"
        }), new BoxModel(new PointModel(x, y, z), 1, 1, 1)));
        x = Math.random() > .5 ? 1 : -1;
        y = Math.random() > .5 ? 1 : -1;
        z = Math.random() > .5 ? 1 : -1;
        x = Math.random() * 10 * x;
        y = Math.random() * 10 * y;
        z = Math.random() * 10 * z;
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
