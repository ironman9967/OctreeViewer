
var _ = require('lodash');

var OctreeLeafModel = require('../../../infrastructure/models/Octree/OctreeLeafModel');

var BoxFactory = require('../Geometry/Shapes/BoxFactory');
var OctreeValueFactory = require('./OctreeValueFactory');

exports.ToOctreeLeafModel = function (leaf) {
    var octreeLeafModel = new OctreeLeafModel([], [], BoxFactory.ToBoxModel(leaf.BoundingBox));
    _.reduce(leaf.Children, function (models, child) {
        return exports.ToOctreeLeafModel(child);
    }, octreeLeafModel.Children);
    _.reduce(leaf.Values, function (models, value) {
        return OctreeValueFactory.ToOctreeValueModel(value);
    }, octreeLeafModel.Values);
    return octreeLeafModel;
};
