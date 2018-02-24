import { AnimatedSprite } from "../core/animated-sprite";
import { Point } from "../core/geometry/point";
import {gameEngine} from '../scripts/game-engine';
import {Rectangle} from '../core/geometry/rectangle';

export abstract class Enemy extends AnimatedSprite {
  position: Point;
  currentScreen;
  collisionOffsetLeft;
  collisionOffsetRight;
  collisionOffsetTop;
  collisionOffsetBottom;

  killOffsetLeft;
  killOffsetRight;
  killOffsetTop;
  killOffsetBottom;

  constructor(posX, posY, frameWidth, frameHeight, frameCountX, frameCountY, spriteSheetSrc?: string) {
    super(frameWidth, frameHeight, frameCountX, frameCountY, spriteSheetSrc);
    this.position = new Point(posX, posY);
    this.currentScreen = this.position.y / gameEngine.canvas.width;
  }

  get collisionBox() {
    return new Rectangle(this.position.x + this.collisionOffsetLeft,
      this.position.y + this.collisionOffsetTop,
      this.frameSize.width - (this.collisionOffsetRight * 2),
      this.frameSize.height - this.collisionOffsetBottom);
  }

  update(currentSectors) {
  }
}
