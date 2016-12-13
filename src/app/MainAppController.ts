export default class MainAppController {
  public game: any = this.GameManager;
  public gs: any = this.GridService;
  private newGame = () => {
    this.KeyboardService.init();
    this.game.newGame();
    this.startGame();
  };
  private startGame = () => {
    this.KeyboardService.on((key) => {
      this.game.move(key)
      this.$scope.$apply()
    }); 
  };
  constructor(private GameManager, private KeyboardService, private GridService, private $scope) {
    this.newGame();
  }
};