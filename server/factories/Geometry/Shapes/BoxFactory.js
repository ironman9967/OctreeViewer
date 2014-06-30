
var Box = require('octree').geometry.shapes.box;
var BoxModel = require('../../../../infrastructure/models/Geometry/Shapes/BoxModel');

var PointFactory = require('../PointFactory');

exports.ToBox = function (boxModel) {
    return new Box(PointFactory.ToPoint(boxModel.Center), boxModel.Width, boxModel.Height, boxModel.Depth);
};

exports.ToBoxModel = function (box) {
    return new BoxModel(PointFactory.ToPointModel(box.Center), box.Width, box.Height, box.Depth);
};
