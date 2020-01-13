import {State} from "../core/state-machine/state";
import {gameEngine} from "../scripts/game-engine";

export class InGameState implements State {

  constructor() {
    gameEngine.initialize(<HTMLCanvasElement> document.getElementById('gameCanvas'));
  }

  update() {
    gameEngine.update();
  }

  handleInput() {

  }

  enter(...args: any[]) {
  }

  exit() {
  }

  draw() {
    gameEngine.draw();
  }

}
