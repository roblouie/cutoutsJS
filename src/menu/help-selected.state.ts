import {State} from "../core/state-machine/state";
import {MenuControls} from "./menu-controls";
import {StateMachine} from "../core/state-machine/state-machine";
import {MenuEngine} from "./menu-engine";

export class HelpSelectedState implements State {
  private helpSelectedImage = new Image();
  private context: CanvasRenderingContext2D;
  private stateMachine: StateMachine;
  private canSelect = true;

  constructor(context: CanvasRenderingContext2D, stateMachine: StateMachine) {
    this.context = context;
    this.stateMachine = stateMachine;
    this.helpSelectedImage.src = require('./main-menu/help-selected.png');
  }

  update() {
  }

  handleInput() {
    if (MenuControls.Up) {
      this.stateMachine.change(MenuEngine.States.StartSelected);
    }

    if (!MenuControls.Select) {
      this.canSelect = true;
    }

    if (MenuControls.Select && this.canSelect) {
      this.stateMachine.change(MenuEngine.States.HelpScreens);
    }
  }

  enter(...args: any[]) {
    if (MenuControls.Select) {
      this.canSelect = false;
    }

    console.log('Entering Help Selected State');
  }

  draw() {
    this.context.drawImage(this.helpSelectedImage, 0, 0);
  }

  exit() {
  }

}
