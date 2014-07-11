
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

    this._meshes = [];

    this._setupEvents($rootScope);
};

OctreeScene.prototype._setupEvents = function ($rootScope) {
    var instance = this;
    $rootScope.$on('leaves', function () {
        instance._leaves.apply(instance, arguments);
    });
    $rootScope.$on('values', function () {
        instance._values.apply(instance, arguments);
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

OctreeScene.prototype._leaves = function (event, leafBoxes) {
    var instance = this;
    var lookAt = true;
    _.each(leafBoxes, function (leafBox) {
        instance._addBox(leafBox, {
            lookAt: lookAt
        });
        lookAt = false;
    });
};

OctreeScene.prototype._values = function (event, values) {
    var instance = this;
    _.each(values, function (value) {
        instance._addBox(value.BoundingBox, {
            wireframe: false,
            addCenterDot: false
        });
    });
};

OctreeScene.prototype._addBox = function (box, opt) {
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
    }

    this._meshes[box.id] = mesh;

    this._scene.add(mesh);
    this._scene.add(centerDotMesh);

    if (opt.lookAt) {
        this._camera.lookAt(new THREE.Vector3(box.Center.X, box.Center.Y, box.Center.Z));
    }
};

OctreeScene.prototype._removeBox = function (id) {
    var temp = [];
    var instance = this;
    _.each(this._meshes, function (mesh) {
        if (id !== mesh.id) {
            temp.push(mesh);
        }
        else {
            instance._scene.remove(mesh);
        }
    });
    this._meshes = temp;
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
