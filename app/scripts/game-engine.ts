class GameEngine {
  private readonly _isDebugMode = false;
    canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;
    previousXPosition: number = 0;

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


  setupRequestAnimationFrame() {
        var lastTime = 0;
        var currTime, timeToCall, id;
        var vendors = ['ms', 'moz', 'webkit', 'o'];
        for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
            window.cancelAnimationFrame =
                window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame) {
            window.requestAnimationFrame = function(callback) {
                currTime = Date.now();
                timeToCall = Math.max(0, 16 - (currTime - lastTime));
                id = window.setTimeout(function() { callback(currTime + timeToCall); },
                    timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        }
        if (!window.cancelAnimationFrame)
        {
            window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            };
        }
    }
}

export const gameEngine = new GameEngine();
