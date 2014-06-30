
var Point = require('octree').geometry.point;
var PointModel = require('../../../infrastructure/models/Geometry/PointModel');

exports.ToPoint = function (pointModel) {
    return new Point(pointModel.X, pointModel.Y, pointModel.Z);
};

exports.ToPointModel = function (point) {
    return new PointModel(point.X, point.Y, point.Z);
};
