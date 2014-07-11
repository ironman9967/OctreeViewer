
function OctreeValueModel(id, value, boundBoxModel) {
    this.id = id;
    this.Value = value;
    this.BoundingBox = boundBoxModel;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OctreeValueModel;
}
