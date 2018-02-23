import { Point } from "../core/geometry/point";
import { SourceImage } from "../core/source-image";
import { AnimatedSprite } from "../core/animated-sprite";
import {Enemy} from "./enemy";

export class Bee extends Enemy {
  private static AnimationData = {
    frameWidth: 192,
    frameHeight: 158,
    columns: 6,
    rows: 1,
    imageSource: '../images/enemies/bee.png'
  };

  private isOnGround: boolean;
  private readonly groundDrag = 0.68;
  private readonly airDrag = 0.65;
  private readonly gravity = 500;
  private readonly moveSpeed = 1000;
  private movement = -1;
  private previousBottom;

  velocity = new Point();
  maxVelocity = new Point(1000, 500);

  constructor(x, y) {
    super(x, y, Bee.AnimationData.frameWidth, Bee.AnimationData.frameHeight,
      Bee.AnimationData.columns, Bee.AnimationData.rows, Bee.AnimationData.imageSource);

    this.millisecondsPerFrame = 25;
  }
}
