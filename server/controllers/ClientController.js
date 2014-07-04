
var util = require('util');

var _ = require('lodash');

var octree = require('octree');

var OctreeValueFactory = require('../factories/Octree/OctreeValueFactory');

function ClientController(socket) {
    octree.helpers.eventer.call(this);
    this._eventer = octree.helpers.eventer.prototype;

    this._socket = socket;
    this._setupEvents();
}
util.inherits(ClientController, octree.helpers.eventer);

ClientController.prototype._setupEvents = function () {
    this._setupSocketEvents();
};

ClientController.prototype._setupSocketEvents = function () {
    this.ListenToAnother('insertValue', this._socket);
    this.ListenToAnother('query', this._socket);
};

ClientController.prototype._insertValue = function (valueModel) {
    this.emit('insertValue', OctreeValueFactory.ToOctreeValue(valueModel));
};

ClientController.prototype._query = function () {
    this.emit.apply(this, ([ 'query' ]).concat(_.toArray(arguments)).concat([ this._socket ]));
};

ClientController.prototype._dispose = function () {
    this._eventer._dispose.apply(this, arguments);
};

module.exports = ClientController;
