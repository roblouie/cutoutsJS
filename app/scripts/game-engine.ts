class GameEngine {
  private readonly _isDebugMode = false;
    canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    previousXPosition: number = 0;
  millisecondsSinceLast: number = 0;

    get context() {
      return this._context;
    }

    get isDebugMode() {
      return this._isDebugMode;
    }

    setCanvas(canvasId) {
      this.canvas = <HTMLCanvasElement> document.getElementById(canvasId);
      this._context = this.canvas.getContext("2d");
    }

    scrollCanvas(xPosition, mapWidth) {
      const playerOffset = this.canvas.width / 2;

      if (xPosition < playerOffset || xPosition + playerOffset > mapWidth) {
        return;
      }

      const newPosition = this.previousXPosition - xPosition + playerOffset;
      this._context.translate(newPosition, 0);
      this.previousXPosition = xPosition - playerOffset;
    }
}

export const gameEngine = new GameEngine();
