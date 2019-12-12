import { AnimatedSprite } from "../core/animated-sprite";
import { Point } from "../core/geometry/point";
import {gameEngine} from '../scripts/game-engine';
import {Rectangle} from '../core/geometry/rectangle';

export abstract class Enemy extends AnimatedSprite {
  position: Point;
  type: string;
  ownedScreen;
  collisionOffsetLeft;
  collisionOffsetRight;
  collisionOffsetTop;
  collisionOffsetBottom;

  killOffsetLeft;
  killOffsetRight;
  killOffsetTop;
  killOffsetBottom;

  constructor(posX, posY, frameWidth, frameHeight, frameCountX, frameCountY, type: string, spriteSheetSrc?: string) {
    super(frameWidth, frameHeight, frameCountX, frameCountY, spriteSheetSrc);
    this.position = new Point(posX, posY);
    this.type = type;
    this.ownedScreen = Math.floor(this.position.x / gameEngine.canvas.width);
  }

  get collisionBox() {
    return new Rectangle(this.position.x + this.collisionOffsetLeft,
      this.position.y + this.collisionOffsetTop,
      this.frameSize.width - (this.collisionOffsetRight * 2),
      this.frameSize.height - this.collisionOffsetBottom);
  }

  get killBox() {
    return new Rectangle(this.position.x + this.killOffsetLeft,
      this.position.y + this.killOffsetTop,
      this.frameSize.width - (this.killOffsetRight * 2),
      this.frameSize.height - this.killOffsetBottom);
  }

  get centerScreenIndex() {
    return Math.floor(this.collisionBox.center.x / gameEngine.canvas.width);
  }

  update(currentSectors) {
  }
}
