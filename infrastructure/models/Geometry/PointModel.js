
function PointModel(x, y, z) {
    this.X = x;
    this.Y = y;
    this.Z = z;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = PointModel;
}
