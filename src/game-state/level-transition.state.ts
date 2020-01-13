import {State} from "../core/state-machine/state";

export class LevelTransitionState implements State {
  private context: CanvasRenderingContext2D;

  constructor() {
    const canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
    this.context = canvas.getContext("2d");
  }

  update() {
  }

  handleInput() {
  }

  enter(...args: any[]) {
  }

  exit() {
  }

  draw() {
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, 1280, 720);
  }
}
