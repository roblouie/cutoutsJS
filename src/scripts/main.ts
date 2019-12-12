'use strict';
import controls from '../core/controls';
import {gameEngine} from './game-engine';
import {soundService} from '../core/sound';

gameEngine.initialize(<HTMLCanvasElement> document.getElementById('gameCanvas'));

const Game = { play: null };

(function () {
  var last = 0; // last frame timestamp
  var now = 0; // current timestamp
  var step = now - last; // time between frames

  // Game update function
  var update = function (step) {
    if (step > 17) {
      return;
    }

    controls.queryControllers();
    gameEngine.update();
  };


  // Game draw function
  var draw = function (step) {
    if (step > 17) {
      return;
    }
    // clear the entire canvas
    gameEngine.context.clearRect(0, 0, gameEngine.canvas.width, gameEngine.canvas.height);
    // redraw all objects
    gameEngine.draw();
  };

  // Game Loop
  var gameLoop = function (timestamp) { // <-- edited; timestamp comes from requestAnimationFrame. See polyfill to get this insight.
    now = timestamp; // <-- current timestamp (in milliseconds)
    step = now - last; // <-- time between frames (in seconds)
    last = now; // <-- store the current timestamp for further evaluation in next frame/step
    gameEngine.millisecondsSinceLast = step;
    update(step);
    draw(step);
    requestAnimationFrame(gameLoop); // <-- added
  };

  Game.play = function () {
      requestAnimationFrame(gameLoop); // <-- changed
      console.log("play");
  }

})();


window.onload = function () {
  Game.play();
  //@ts-ignore
  document.getElementById('mute').onclick = () => {
    soundService.initializeAudioCtx();
  };
};

