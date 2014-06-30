
function BoxModel(centerModel, width, height, depth) {
    this.Center = centerModel;
    this.Width = width;
    this.Height = height;
    this.Depth = depth;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = BoxModel;
}
