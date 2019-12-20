'use strict';
import controls from '../core/controls';
import {gameEngine} from './game-engine';
import {soundService} from '../core/sound';
import {menuEngine} from '../menu/menu-engine';

gameEngine.initialize(<HTMLCanvasElement> document.getElementById('gameCanvas'));
menuEngine.initialize(<HTMLCanvasElement> document.getElementById('gameCanvas'));

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
    //gameEngine.update();
    menuEngine.update();
  };


  // Game draw function
  var draw = function (step) {
    if (step > 17) {
      return;
    }
    // clear the entire canvas
    gameEngine.context.clearRect(0, 0, gameEngine.canvas.width, gameEngine.canvas.height);
    // redraw all objects
    //gameEngine.draw();
    menuEngine.draw();
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

  document.getElementById('fullscreen').onclick = () => {
    const elem = document.getElementById("window");
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      //@ts-ignore
    } else if (elem.msRequestFullscreen) {
      //@ts-ignore
      elem.msRequestFullscreen();
      //@ts-ignore
    } else if (elem.mozRequestFullScreen) {
      //@ts-ignore
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
  }
};

