import {MenuControls} from './menu-controls';

class MenuEngine {
  canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private backgroundImage = new Image();
  private startSelectedImage = new Image();
  private helpSelectedImage = new Image();
  private currentHelpScreen = 0;
  private isStartSelected = false;

  initialize(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.backgroundImage.src = require('./main-menu/background.png');
    this.startSelectedImage.src = require('./main-menu/start-selected.png');
    this.helpSelectedImage.src = require('./main-menu/help-selected.png');
  }

  update() {
    if (MenuControls.Up) {
      this.isStartSelected = !this.isStartSelected;
    }
  }

  draw() {
    this.context.drawImage(this.backgroundImage, 0, 0);
    if (this.isStartSelected) {
      this.context.drawImage(this.startSelectedImage, 0, 0);
    } else {
      this.context.drawImage(this.helpSelectedImage, 0, 0);
    }
  }
}

export const menuEngine = new MenuEngine();