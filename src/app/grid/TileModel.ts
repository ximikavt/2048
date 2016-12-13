export default class TileModel {
    constructor(GenerateUniqueId) {
        let Tile = function (pos, val) {
            this.x = pos.x;
            this.y = pos.y;
            this.value = val || 2;
            this.id = GenerateUniqueId.next();
            this.merged = null;
        };
        Tile.prototype.savePosition = function () {
            this.originalX = this.x;
            this.originalY = this.y;
        };

        Tile.prototype.reset = function () {
            this.merged = null;
        };

        Tile.prototype.setMergedBy = function (arr) {
            var self = this;
            arr.forEach(function (tile) {
                tile.merged = true;
                tile.updatePosition(self.getPosition());
            });
        };

        Tile.prototype.updateValue = function (newVal) {
            this.value = newVal;
        };

        Tile.prototype.updatePosition = function (newPosition) {
            this.x = newPosition.x;
            this.y = newPosition.y;
        };

        Tile.prototype.getPosition = function () {
            return {
                x: this.x,
                y: this.y
            };
        };
        return Tile;
    }
};