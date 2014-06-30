
var OctreeValue = require('octree').value;
var OctreeValueModel = require('../../../infrastructure/models/Octree/OctreeValueModel');

var BoxFactory = require('../Geometry/Shapes/BoxFactory');

exports.ToOctreeValue = function (valueModel) {
    return new OctreeValue(valueModel.Value, BoxFactory.ToBox(valueModel.BoundingBox));
};

exports.ToOctreeValueModel = function (octreeValue) {
    return new OctreeValueModel(octreeValue.Value, BoxFactory.ToBoxModel(octreeValue.BoundingBox));
};
