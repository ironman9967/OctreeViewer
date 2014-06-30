
var OctreeFactory = function ($rootScope) {
    $rootScope.hostname = window.location.hostname;
    var scene = new OctreeScene($rootScope);
    return {
        init: function () {
            scene.Init($rootScope);
        },
        reorient: function () {
            scene.Reorient($rootScope);
        }
    };
};


