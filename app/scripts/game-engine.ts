class GameEngine {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    setCanvas(canvasId) {
      this.canvas = <HTMLCanvasElement> document.getElementById(canvasId);
      this.context = this.canvas.getContext("2d");
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
