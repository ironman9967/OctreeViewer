
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

    this._setupEvents();
}
util.inherits(OctreeController, octree.helpers.eventer);

OctreeController.prototype._setupEvents = function () {
    this._eventer._setupEvents.call(this);
    this.Listen('insertValue');
    this.Listen('query');
    this.Listen('newClient');

    this.ListenToAnother('newRoot', this._octree);
    this.ListenToAnother('valueInserted', this._octree);
    this.ListenToAnother('leafAdded', this._octree);
    this.ListenToAnother('leafRemoved', this._octree);
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

OctreeController.prototype._newClient = function (socket) {
    //TODO: send new client all leaves
};

OctreeController.prototype._valueInserted = function (value) {
    this._io.emit('valueInserted', OctreeValueFactory.ToOctreeValueModel(value));
};

OctreeController.prototype._newRoot = function (leaf) {
    this._io.emit('newRoot', {
        id: leaf.id,
        box: BoxFactory.ToBoxModel(leaf.BoundingBox)
    });
};

OctreeController.prototype._leafAdded = function (leaf) {
    this._io.emit('leafAdded', {
        id: leaf.id,
        box: BoxFactory.ToBoxModel(leaf.BoundingBox)
    });
};

OctreeController.prototype._leafRemoved = function (leaf) {
    this._io.emit('leafRemoved', leaf.id);
};

OctreeController.prototype._dispose = function () {
    this._eventer._dispose.apply(this, arguments);
};

module.exports = OctreeController;
