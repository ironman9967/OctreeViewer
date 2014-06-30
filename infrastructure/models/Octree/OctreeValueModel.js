
function OctreeValueModel(value, boundBoxModel) {
    this.Value = value;
    this.BoundingBox = boundBoxModel;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OctreeValueModel;
}
