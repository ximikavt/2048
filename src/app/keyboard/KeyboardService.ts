export default class KeyboardService {
    private UP: string = 'up';
    private RIGHT: string = 'right';
    private DOWN: string = 'down';
    private LEFT: string = 'left';
    private keyEventHandlers = [];
    private keyboardMap = {
        37: this.LEFT,
        38: this.UP,
        39: this.RIGHT,
        40: this.DOWN
    };
    public init = () => {
        this.$document.bind('keydown', (evt) => {
            let key = this.keyboardMap[evt.which];

            if (key) {
                // Нажата нужная клавиша
                evt.preventDefault();
                this._handleKeyEvent(key, evt);
            }
        });
    };
    private _handleKeyEvent = (key, evt) => {
        var callbacks = this.keyEventHandlers;
        if (!callbacks) {
            return;
        }

        evt.preventDefault();
        if (callbacks) {
            for (var x = 0; x < callbacks.length; x++) {
                var cb = callbacks[x];
                cb(key, evt);
            }
        }
    };
    private on = (cb) => {
        this.keyEventHandlers.push(cb);
    };
    constructor(private $document: ng.IDocumentService) {}
};