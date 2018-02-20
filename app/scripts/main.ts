'use strict';
import {Map} from './map';
import {Player} from './player';
import {Camera} from './camera';
import {Hud} from './hud';
import {Vector2} from './vector-2';
import controls from '../core/controls';
import {gameEngine} from './game-engine';

gameEngine.setupRequestAnimationFrame();
gameEngine.setCanvas('gameCanvas');

const Game = { play: null, togglePause: null, controls: null };

(function(){
    // prepaire our game canvas
    var context = gameEngine.context;

    // game settings: // <-- some game settings were removed because requestAnimationFrame controls the screen automatically
    //var FPS = 30; <--removed
    //var INTERVAL = 1000/FPS; // milliseconds <--removed
    var last = 0; // last frame timestamp
    var now = 0; // current timestamp
    var step = now-last; // time between frames

    // setup an object that represents the room
    const map = new Map();

    var hud = new Hud('../images/hud/livesMarker.png', '../images/hud/collectible.png', new Vector2(10, 10), new Vector2(1150, 10));

    // setup player
    var player = new Player(50, 50, map.width, map.height);

    // setup the magic camera !!!
    var camera = new Camera(0, 0, gameEngine.canvas.width, gameEngine.canvas.height, map.width, map.height);
    camera.follow(player, gameEngine.canvas.width/2, gameEngine.canvas.height/2);

    // Game update function
    var update = function(step){
        controls.queryControllers();
        //player.update(step); // <-- edited
        camera.update();
    };

    // Game draw function
    var draw = function(step){
        // clear the entire canvas
        context.clearRect(0, 0, gameEngine.canvas.width, gameEngine.canvas.height);

        // redraw all objects
        map.draw(context, camera.xView, camera.yView);
        player.drawPlayer(context, step, camera.xView, camera.yView);
        hud.draw(context);
    };

    var runningId = -1;

    // Game Loop
    var gameLoop = function(timestamp){ // <-- edited; timestamp comes from requestAnimationFrame. See polyfill to get this insight.
        now = timestamp; // <-- current timestamp (in milliseconds)
        step = now - last; // <-- time between frames (in seconds)
        last = now; // <-- store the current timestamp for further evaluation in next frame/step
        update(step);
        draw(step);
        runningId = requestAnimationFrame(gameLoop); // <-- added
    }

    // ---configure play/pause capabilities:

    Game.play = function(){
        if(runningId === -1){
            runningId = requestAnimationFrame(gameLoop); // <-- changed
            console.log("play");
        }
    }

    Game.togglePause = function(){
        if(runningId === -1){
            Game.play();
        }
        else
        {
            cancelAnimationFrame(runningId);// <-- changed
            runningId = -1;
            console.log("paused");
        }
    }

    // ---

})();



window.onload = function(){
    Game.play();
}

