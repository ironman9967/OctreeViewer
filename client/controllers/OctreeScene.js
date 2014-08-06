
var OctreeScene = function ($rootScope) {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(75, $rootScope.canvasWidth / $rootScope.canvasHeight, 0.1, 1000);
    this._renderer = new THREE.WebGLRenderer({
        canvas: $("#viewerCanvas")[0]
    });

    this._wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true
    });
    this._solidMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000
    });

    this._octreeValues = [];
    this._octreeLeaves = [];

    this._setupEvents($rootScope);
};

OctreeScene.prototype._setupEvents = function ($rootScope) {
    var instance = this;

    $rootScope.$on('newRoot', function () {
        instance._newRoot.apply(instance, _.rest(arguments));
    });
    $rootScope.$on('leafAdded', function () {
        instance._leafAdded.apply(instance, _.rest(arguments));
    });
    $rootScope.$on('leafRemoved', function () {
        instance._leafRemoved.apply(instance, _.rest(arguments));
    });
    $rootScope.$on('values', function () {
        instance._values.apply(instance, _.rest(arguments));
    });

    this._listenForCameraEvents($rootScope);
};

OctreeScene.prototype.Init = function ($rootScope) {
    this._setRendererSize($rootScope);
    this._camera.position.x = 5;
    this._camera.position.y = 15;
    this._camera.position.z = 25;
    this._startRenderer();
};

OctreeScene.prototype.Reorient = function ($rootScope) {
    this._updateCameraAspect($rootScope);
    this._setRendererSize($rootScope);
};

OctreeScene.prototype._setRendererSize = function ($rootScope) {
    this._renderer.setSize($rootScope.canvasWidth, $rootScope.canvasHeight);
};

OctreeScene.prototype._updateCameraAspect = function ($rootScope) {
    this._camera.aspect = $rootScope.canvasWidth / $rootScope.canvasHeight;
    this._camera.updateProjectionMatrix();
};

OctreeScene.prototype._startRenderer = function () {
    var instance = this;
    var render = function () {
        requestAnimationFrame(render);
        instance._renderer.render(instance._scene, instance._camera);
    };
    render();
};

OctreeScene.prototype._newRoot = function (boxInfo) {
    this._leafAdded(boxInfo);
};

OctreeScene.prototype._leafAdded = function (boxInfo) {
    var box = boxInfo.box;
    this._octreeLeaves.push({
        id: boxInfo.id,
        meshes: this._addBox(box)
    });
};

OctreeScene.prototype._leafRemoved = function (boxId) {
    var tempLeaves = [];
    var found = true;
    var instance = this;
    _.each(this._octreeLeaves, function (l) {
        if (l.id !== boxId) {
            tempLeaves.push(l);
        }
        else {
            found = true;
            _.each(l.meshes, function (mesh) {
                instance._scene.remove(mesh);
            });
        }
    });
    if (found) {
        instance._octreeLeaves = tempLeaves;
    }
};

OctreeScene.prototype._values = function (values) {
    var instance = this;
    _.each(this._octreeValues, function (value) {
        _.each(value.meshes, function (mesh) {
            instance._scene.remove(mesh);
        });
    });
    this._octreeValues = [];
    _.each(values, function (value) {
        instance._octreeValues.push({
            id: value.id,
            meshes: instance._addBox(value.BoundingBox, {
                wireframe: false,
                addCenterDot: false
            })
        });
    });
};

OctreeScene.prototype._addBox = function (box, opt) {
    var meshes = [];
    if (_.isUndefined(opt)) opt = {};
    opt = {
        lookAt: !_.isUndefined(opt.lookAt) ? opt.lookAt : false,
        wireframe: !_.isUndefined(opt.wireframe) ? opt.wireframe : true,
        addCenterDot: !_.isUndefined(opt.addCenterDot) ? opt.addCenterDot : true
    };
    var boundingBox = new THREE.BoxGeometry(box.Width, box.Height, box.Depth);
    var mesh = new THREE.Mesh(boundingBox, opt.wireframe ? this._wireframeMaterial: this._solidMaterial);
    mesh.position.set(box.Center.X, box.Center.Y, box.Center.Z);

    if (opt.addCenterDot) {
        var centerDot = new THREE.SphereGeometry(.25);
        var centerDotMesh = new THREE.Mesh(centerDot, this._solidMaterial);
        centerDotMesh.position.set(box.Center.X, box.Center.Y, box.Center.Z);
        this._scene.add(centerDotMesh);
        meshes.push(centerDotMesh);
    }

    this._scene.add(mesh);
    meshes.push(mesh);

    if (opt.lookAt) {
        this._camera.lookAt(new THREE.Vector3(box.Center.X, box.Center.Y, box.Center.Z));
    }

    return meshes;
};

OctreeScene.prototype._listenForCameraEvents = function ($rootScope) {
    var instance = this;
    $rootScope.$on('cameraXup', function () {
        instance._moveCameraRelative('x', 'u');
    });
    $rootScope.$on('cameraXdn', function () {
        instance._moveCameraRelative('x', 'd');
    });
    $rootScope.$on('cameraYup', function () {
        instance._moveCameraRelative('y', 'u');
    });
    $rootScope.$on('cameraYdn', function () {
        instance._moveCameraRelative('y', 'd');
    });
    $rootScope.$on('cameraZup', function () {
        instance._moveCameraRelative('z', 'u');
    });
    $rootScope.$on('cameraZdn', function () {
        instance._moveCameraRelative('z', 'd');
    });
};

OctreeScene.prototype._moveCameraRelative = function (xyz, updown) {
    var amount = 5;

    var x = this._camera.position.x;
    var y = this._camera.position.y;
    var z = this._camera.position.z;

    switch (xyz) {
        case 'x':
            switch (updown) {
                case 'u':
                    x += amount;
                    break;
                case 'd':
                    x -= amount;
                    break;
            }
            break;
        case 'y':
            switch (updown) {
                case 'u':
                    y += amount;
                    break;
                case 'd':
                    y -= amount;
                    break;
            }
            break;
        case 'z':
            switch (updown) {
                case 'u':
                    z += amount;
                    break;
                case 'd':
                    z -= amount;
                    break;
            }
            break;
    }

    this._moveCamera(x, y ,z);
};

OctreeScene.prototype._moveCamera = function (x, y, z, lookAtX, lookAtY, lookAtZ) {
    this._camera.position.set(x, y, z);
    this._camera.lookAt(new THREE.Vector3(
        _.isUndefined(lookAtX) ? 0 : lookAtX,
        _.isUndefined(lookAtY) ? 0 : lookAtY,
        _.isUndefined(lookAtZ) ? 0 : lookAtZ
    ));
};
