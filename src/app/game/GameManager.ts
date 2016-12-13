export default class GameManager {
    private gameOver: boolean;
    private win: boolean;
    public currentScore: number = 0;
    public highScore: number = 0;

    private winningValue: number = 2048;
    public getHighScore = () => {
        return parseInt(this.$cookieStore.get('highScore')) || 0;
    }
    // Создать новую игру
    public newGame = () => {
        
        this.GridService.buildEmptyGameBoard();
        this.GridService.buildStartingPosition();
        this.reinit();
    };
    private reinit = () => {
        this.gameOver = false;
        this.win = false;
        this.currentScore = 0;
        this.highScore = this.getHighScore(); // вернёмся сюда позже
    };
    // Обработка хода
    public move = (key) => {
        let f = () => {
            if (this.win) { return false; }
            let positions = this.GridService.traversalDirections(key);
            let hasMoved = false;
            let hasWon = false;

            // Update Grid
            this.GridService.prepareTiles();

            positions.x.forEach((x) => {
                positions.y.forEach((y) => {
                    let originalPosition = { x: x, y: y };
                    let tile = this.GridService.getCellAt(originalPosition);

                    if (tile) {
                        let cell = this.GridService.calculateNextPosition(tile, key),
                            next = cell.next;

                        if (next &&
                            next.value === tile.value &&
                            !next.merged) {

                            // MERGE
                            let newValue = tile.value * 2;

                            let merged = this.GridService.newTile(tile, newValue);
                            merged.merged = [tile, cell.next];

                            this.GridService.insertTile(merged);
                            this.GridService.removeTile(tile);

                            this.GridService.moveTile(merged, next);

                            this.updateScore(this.currentScore + cell.next.value);

                            if (merged.value >= this.winningValue) {
                                hasWon = true;
                            }
                            hasMoved = true; // we moved with a merge
                        } else {
                            this.GridService.moveTile(tile, cell.newPosition);
                        }

                        if (!this.GridService.samePositions(originalPosition, cell.newPosition)) {
                            hasMoved = true;
                        }
                    }
                });
            });

            if (hasWon && !this.win) {
                this.win = true;
            }

            if (hasMoved) {
                this.GridService.randomlyInsertNewTile();

                if (this.win || !this.movesAvailable()) {
                    this.gameOver = true;
                }
            }

        };
        return this.$q.when(f());
    };
    // Обновление очков
    public updateScore = (newScore) => {
        console.log(newScore);
        this.currentScore = newScore;
        if (this.currentScore > this.getHighScore()) {
            this.highScore = newScore;
            // Set on the cookie
            this.$cookieStore.put('highScore', newScore);
        }
    };
    // Остались ли ещё ходы?
    public movesAvailable = () => {
        return this.GridService.anyCellsAvailable() ||
            this.GridService.tileMatchesAvailable();
    };

    constructor(private GridService, private $cookieStore, private $q: ng.IQService) {
        // this.reinit();
    }
}