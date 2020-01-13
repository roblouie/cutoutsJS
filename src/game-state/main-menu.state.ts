import {State} from "../core/state-machine/state";
import {MenuEngine} from "../menu/menu-engine";

export class MainMenuState implements State {
  private menuEngine = new MenuEngine();

  constructor() {
    this.menuEngine.initialize(<HTMLCanvasElement> document.getElementById('gameCanvas'));
  }

  update() {
    this.menuEngine.update();
  }

  handleInput() {
    this.menuEngine.handleInput();
  }

  enter(...args: any[]) {
  }

  exit() {
  }

  draw() {
    this.menuEngine.draw();
  }
}
