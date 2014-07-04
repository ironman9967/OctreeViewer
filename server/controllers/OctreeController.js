
var util = require('util');

var _ = require('lodash');

var octree = require('octree');

var OctreeValueFactory = require('../factories/Octree/OctreeValueFactory');
var BoxFactory = require('../factories/Geometry/Shapes/BoxFactory');

function OctreeController(io) {
    octree.helpers.eventer.call(this);
    this._eventer = octree.helpers.eventer.prototype;

    this._io = io;
    this._octree = octree.createTree();

    this._broadcastLeavesDelay = 5000;
    this._leafBroadcasterTimeout = void 0;

    this._setupEvents();
}
util.inherits(OctreeController, octree.helpers.eventer);

OctreeController.prototype._setupEvents = function () {
    this._eventer._setupEvents.call(this);
    this.Listen('insertValue');
    this.Listen('query');

    this.ListenToAnother('rootInitialized', this._octree);
};

OctreeController.prototype._insertValue = function () {
    this._octree.emit.apply(this._octree, ([ 'insertValue' ]).concat(_.toArray(arguments)));
};

OctreeController.prototype._query = function (socket) {
    this._octree.emit('query', function (values) {
        var models = [];
        _.each(values, function (value) {
            models.push(OctreeValueFactory.ToOctreeValueModel(value));
        });
        socket.emit('values', models);
    });
};

OctreeController.prototype._rootInitialized = function () {
    this._broadcastLeaves();
};

OctreeController.prototype._broadcastLeaves = function () {
    this._emitLeaves();
    var instance = this;
    this._leafBroadcasterTimeout = setTimeout(function () {
        instance._emitLeaves(function () {
            instance._broadcastLeaves();
        });
    }, this._broadcastLeavesDelay);
};

OctreeController.prototype._emitLeaves = function (callback) {
    var instance = this;
    this._octree.emit('getLeafBoundingBoxes', function (boxes) {
        var models = [];
        _.each(boxes, function (box) {
            models.push(BoxFactory.ToBoxModel(box));
        });
        instance._io.sockets.emit('leaves', models);
        if (!_.isUndefined(callback)) {
            callback();
        }
    });
};

OctreeController.prototype._dispose = function () {
    clearTimeout(this._leafBroadcasterTimeout);
    this._eventer._dispose.apply(this, arguments);
};

module.exports = OctreeController;
