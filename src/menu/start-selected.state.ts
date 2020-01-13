import {State} from "../core/state-machine/state";
import {MenuControls} from "./menu-controls";
import {StateMachine} from "../core/state-machine/state-machine";
import {MenuEngine} from "./menu-engine";
import {gameStateManager} from "../game-state/game-state-manager";

export class StartSelectedState implements State {
  private startSelectedImage = new Image();
  private context: CanvasRenderingContext2D;
  private stateMachine: StateMachine;

  constructor(context: CanvasRenderingContext2D, stateMachine: StateMachine) {
    this.context = context;
    this.stateMachine = stateMachine;
    this.startSelectedImage.src = require('./main-menu/start-selected.png');
  }

  update() {
  }

  handleInput() {
    if (MenuControls.Down) {
      this.stateMachine.change(MenuEngine.States.HelpSelected);
    }

    if (MenuControls.Select) {
      gameStateManager.goInGame();
    }
  }

  enter(...args: any[]) {
    console.log('Entering Start Selected State');
  }

  draw() {
    this.context.drawImage(this.startSelectedImage, 0, 0);
  }

  exit() {
  }

}
