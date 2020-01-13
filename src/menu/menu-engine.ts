import {StateMachine} from "../core/state-machine/state-machine";
import {StartSelectedState} from "./start-selected.state";
import {HelpSelectedState} from "./help-selected.state";
import {HelpScreensState} from "./help-screens.state";

export class MenuEngine {
  canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private backgroundImage = new Image();

  private stateMachine = new StateMachine();

  static States = {
    StartSelected: 'StartSelected',
    HelpSelected: 'HelpSelected',
    HelpScreens: 'HelpScreens'
  };

  initialize(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.backgroundImage.src = require('./main-menu/background.png');

    this.stateMachine.add(MenuEngine.States.StartSelected, new StartSelectedState(this.context, this.stateMachine));
    this.stateMachine.add(MenuEngine.States.HelpSelected, new HelpSelectedState(this.context, this.stateMachine));
    this.stateMachine.add(MenuEngine.States.HelpScreens, new HelpScreensState(this.context, this.stateMachine));
    this.stateMachine.change(MenuEngine.States.StartSelected);
  }

  handleInput() {
    this.stateMachine.handleInput();
  }

  update() {
    this.stateMachine.update();
  }

  draw() {
    this.context.drawImage(this.backgroundImage, 0, 0);
    this.stateMachine.draw();
  }
}
