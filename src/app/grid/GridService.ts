export default class GridService {
    public grid = [];
    public tiles = [];
    private size = 4;

    private startingTileNumber = 2;
    private buildStartingPosition = () => {
        for (let x = 0; x < this.startingTileNumber; x++) {
            this.randomlyInsertNewTile();
        }
    };
    private availableCells = () => {
        let cells = [];

        this.forEach((x, y) => {
            let foundTile = this.getCellAt({ x: x, y: y });
            if (!foundTile) {
                cells.push({ x: x, y: y });
            }
        });

        return cells;
    };
    public getSize = function() {
      return this.size;
    };
    private randomlyInsertNewTile = () => {
        let cell = this.randomAvailableCell(),
            tile = new this.TileModel(cell, 2);
        this.insertTile(tile);
    };

    // Добавить плитку в массив
    private insertTile = (tile) => {
        let pos = this._coordinatesToPosition(tile);
        this.tiles[pos] = tile;
    };

    // Убрать плитку из массива
    private removeTile = (tile) => {
        let pos = this._coordinatesToPosition(tile);
        delete this.tiles[pos];
    }
    private randomAvailableCell = () => {
        let cells = this.availableCells();
        if (cells.length > 0) {
            return cells[Math.floor(Math.random() * cells.length)];
        }
    };
    public buildEmptyGameBoard = () => {
        // Initialize our grid
        for (let x = 0; x < this.size * this.size; x++) {
            this.grid[x] = undefined;
        }

        // Инициализация массива кучкой нулевых объектов
        this.forEach((x, y) => {
            this.setCellAt({ x: x, y: y }, undefined);
        });
    };
    private forEach = (cb) => {
        let totalSize = this.size * this.size;
        for (let i = 0; i < totalSize; i++) {
            let pos = this._positionToCoordinates(i);
            cb(pos.x, pos.y, this.tiles[i]);
        }
    };
    private setCellAt = (pos, tile) => {
        if (this.withinGrid(pos)) {
            let xPos = this._coordinatesToPosition(pos);
            this.tiles[xPos] = tile;
        }
    };
    public getCellAt = (pos) => {
        if (this.withinGrid(pos)) {
            let x = this._coordinatesToPosition(pos);
            return this.tiles[x];
        } else {
            return undefined;
        }
    };
    public prepareTiles = () => {
        this.forEach((x, y, tile) => {
            if (tile) {
                tile.reset();
            }
        });
    };

    public calculateNextPosition = (cell, key) => {
        let vector = this.vectors[key];
        let previous;

        do {
            previous = cell;
            cell = {
                x: previous.x + vector.x,
                y: previous.y + vector.y
            };
        } while (this.withinGrid(cell) && this.cellAvailable(cell));

        return {
            newPosition: previous,
            next: this.getCellAt(cell)
        };
    };
    private cellAvailable = (cell) => {
        if (this.withinGrid(cell)) {
            return !this.getCellAt(cell);
        } else {
            return undefined;
        }
    };
    public newTile = (pos, value) => {
        return new this.TileModel(pos, value);
    };
    public moveTile = (tile, newPosition) => {
        let oldPos = {
            x: tile.x,
            y: tile.y
        };

        // Обновить позицию в массиве
        this.setCellAt(oldPos, undefined);
        this.setCellAt(newPosition, tile);
        // Обновить модель плитки
        tile.updatePosition(newPosition);
    };
    private withinGrid = (cell) => {
        return cell.x >= 0 && cell.x < this.size &&
            cell.y >= 0 && cell.y < this.size;
    };

    private _positionToCoordinates = (i) => {
        let x = i % this.size,
            y = (i - x) / this.size;
        return {
            x: x,
            y: y
        };
    };
    private vectors = {
        'left': { x: -1, y: 0 },
        'right': { x: 1, y: 0 },
        'up': { x: 0, y: -1 },
        'down': { x: 0, y: 1 }
    };
    public samePositions = (a, b) => {
      return a.x === b.x && a.y === b.y;
    };
    public anyCellsAvailable = () => {
      return this.availableCells().length > 0;
    };
    public traversalDirections = (key) => {
        let vector = this.vectors[key];
        let positions = { x: [], y: [] };
        for (let x = 0; x < this.size; x++) {
            positions.x.push(x);
            positions.y.push(x);
        }
        // Перестроимся, если идём вправо
        if (vector.x > 0) {
            positions.x = positions.x.reverse();
        }
        // Перестроим позиции y, если идём вниз
        if (vector.y > 0) {
            positions.y = positions.y.reverse();
        }
        return positions;
    };
    public tileMatchesAvailable = () => {
      let totalSize = this.size * this.size;
      for (let i = 0; i < totalSize; i++) {
        let pos = this._positionToCoordinates(i);
        let tile = this.tiles[i];

        if (tile) {
          // Check all vectors
          for (let vectorName in this.vectors) {
            let vector = this.vectors[vectorName];
            let cell = { x: pos.x + vector.x, y: pos.y + vector.y };
            let other = this.getCellAt(cell);
            if (other && other.value === tile.value) {
              return true;
            }
          }
        }
      }
      return false;
    };
    // Преобразование координат в индекс
    private _coordinatesToPosition = (pos) => {
        return (pos.y * this.size) + pos.x;
    };
    constructor(private TileModel) { }
}