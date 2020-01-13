import {State} from "../core/state-machine/state";
import {MenuControls} from "./menu-controls";
import {StateMachine} from "../core/state-machine/state-machine";
import {MenuEngine} from "./menu-engine";

export class HelpScreensState implements State {
  private canAdvance = true;
  private currentHelpScreen = 0;
  private helpscreens: HTMLImageElement[] = [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
  ];
  private context: CanvasRenderingContext2D;
  private stateMachine: StateMachine;

  constructor(context: CanvasRenderingContext2D, stateMachine: StateMachine) {
    this.context = context;
    this.stateMachine = stateMachine;
    this.helpscreens.forEach((image, index) => {
      image.src = require(`./help-screens/help-screen-${index}`);
    });
  }

  update() {
  }

  handleInput() {
    if (!MenuControls.Select) {
      this.canAdvance = true;
    }

    if (MenuControls.Select && this.canAdvance) {
      this.canAdvance = false;
      if (this.currentHelpScreen < 4) {
        this.currentHelpScreen++;
      } else {
        this.stateMachine.change(MenuEngine.States.HelpSelected);
      }
    }

    if (MenuControls.GoBack) {
      this.stateMachine.change(MenuEngine.States.HelpSelected);
    }
  }

  enter(...args: any[]) {
    this.currentHelpScreen = 0;
    if (MenuControls.Select) {
      this.canAdvance = false;
    }
  }

  draw() {
    this.context.drawImage(this.helpscreens[this.currentHelpScreen], 0, 0);
  }

  exit() {
  }

}
