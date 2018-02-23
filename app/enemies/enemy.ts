import { AnimatedSprite } from "../core/animated-sprite";
import { Point } from "../core/geometry/point";

export abstract class Enemy extends AnimatedSprite {
  position: Point;

  constructor(posX, posY, frameWidth, frameHeight, frameCountX, frameCountY, spriteSheetSrc?: string) {
    super(frameWidth, frameHeight, frameCountX, frameCountY, spriteSheetSrc);
    this.position = new Point(posX, posY);
  }
}
