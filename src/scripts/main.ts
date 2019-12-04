'use strict';
import {Map} from '../levels/map';
import {Player} from '../player/player';
import {Hud} from '../hud/hud';
import controls from '../core/controls';
import {gameEngine} from './game-engine';
import {CollisionResolver} from './collision-resolver';
import {soundService} from '../core/sound';

gameEngine.setCanvas('gameCanvas');

const Game = { play: null, togglePause: null, controls: null };

(function () {
  // prepaire our game canvas
  var context = gameEngine.context;

  // game settings: // <-- some game settings were removed because requestAnimationFrame controls the screen automatically
  //var FPS = 30; <--removed
  //var INTERVAL = 1000/FPS; // milliseconds <--removed
  var last = 0; // last frame timestamp
  var now = 0; // current timestamp
  var step = now - last; // time between frames

  // setup an object that represents the room
  const map = new Map();

  const collisionResolver = new CollisionResolver();

  var hud = new Hud();

  // setup player
  var player = new Player(50, 50);

  // Game update function
  var update = function (step) {
    if (step > 17) { //TODO: Remove, this is
      return;
    }

    controls.queryControllers();
    player.update(gameEngine.millisecondsSinceLast, map.getCurrentCollisionBoxes());
    collisionResolver.checkCollision(map.currentSectors, player);
    // collisionResolver.handlePlayerLevelGeometryCollision(player, map.getCurrentCollisionBoxes());
  };


  // Game draw function
  var draw = function (step) {
    if (step > 17) {
      return;
    }
    // clear the entire canvas
    context.clearRect(0, 0, gameEngine.canvas.width, gameEngine.canvas.height);
    // redraw all objects
    map.draw(gameEngine.previousXPosition);
    player.draw();
    gameEngine.scrollCanvas(player.position.x, map.width);
    hud.draw(player.coins, player.lives);
  };

  var runningId = -1;

  // Game Loop
  var gameLoop = function (timestamp) { // <-- edited; timestamp comes from requestAnimationFrame. See polyfill to get this insight.
    now = timestamp; // <-- current timestamp (in milliseconds)
    step = now - last; // <-- time between frames (in seconds)
    last = now; // <-- store the current timestamp for further evaluation in next frame/step
    gameEngine.millisecondsSinceLast = step;
    update(step);
    draw(step);
    runningId = requestAnimationFrame(gameLoop); // <-- added
  };

  // ---configure play/pause capabilities:

  Game.play = function () {
    if (runningId === -1) {
      runningId = requestAnimationFrame(gameLoop); // <-- changed
      console.log("play");
    }
  }

  Game.togglePause = function () {
    if (runningId === -1) {
      Game.play();
    }
    else {
      cancelAnimationFrame(runningId);// <-- changed
      runningId = -1;
      console.log("paused");
    }
  }

  // ---

})();


window.onload = function () {
  Game.play();
  //@ts-ignore
  document.getElementById('mute').onclick = () => {
    soundService.initializeAudioCtx();
  };
};

