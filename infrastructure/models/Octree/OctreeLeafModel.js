
function OctreeLeafModel(values, children, boundBoxModel, isRoot) {
    this.IsRoot = isRoot;
    this.Values = values;
    this.Children = children;
    this.BoundingBox = boundBoxModel;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = OctreeLeafModel;
}
