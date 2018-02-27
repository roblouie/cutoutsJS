'use strict';
import {Map} from '../levels/map';
import {Player} from './player';
import {Hud} from './hud';
import controls from '../core/controls';
import {gameEngine} from './game-engine';
import {Point} from '../core/geometry/point';
import {Coin} from '../levels/coin';
import {Enemy} from '../enemies/enemy';

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

  var hud = new Hud('../images/hud/livesMarker.png', '../images/hud/collectible.png', new Point(10, 10), new Point(1150, 10));

  // setup player
  var player = new Player(50, 50, map.width, map.height);

  // Game update function
  var update = function (step) {
    controls.queryControllers();
    if (map.currentSectors.length > 0) {
      map.currentSectors[0].coins.forEach((coin: Coin, index: number, coinArray: Coin[]) => {
        if (player.collisionBox.isIntersecting(coin.collisionBox)) {
          coinArray.splice(index, 1);
        }
      });

      map.currentSectors[0].enemies.forEach((enemy: Enemy, index, enemyArray) => {
        const isPlayerEnemyCollision = player.collisionBox.isIntersecting(enemy.collisionBox) && !player.isDying;
        const isPlayerJumpingOnHead = player.isFalling && player.collisionBox.bottom < enemy.collisionBox.center.y;
        if (isPlayerEnemyCollision && isPlayerJumpingOnHead) {
          enemyArray.splice(index, 1);
          player.bounceOffEnemy();
        }
      });
    }
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
    player.drawPlayer(context, step, map.getCurrentCollisionBoxes());
    gameEngine.scrollCanvas(player.position.x, map.width);
    hud.draw(context, gameEngine.previousXPosition);
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
}

