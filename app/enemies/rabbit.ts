import { Point } from "../core/geometry/point";
import { SourceImage } from "../core/source-image";
import { AnimatedSprite } from "../core/animated-sprite";
import {Enemy} from "./enemy";

export class Rabbit extends Enemy {
  private static AnimationData = {
    frameWidth: 130,
    frameHeight: 120,
    columns: 5,
    rows: 1,
    imageSource: '../images/enemies/rabbit.png'
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
    super(x, y, Rabbit.AnimationData.frameWidth, Rabbit.AnimationData.frameHeight,
      Rabbit.AnimationData.columns, Rabbit.AnimationData.rows, Rabbit.AnimationData.imageSource);

    this.millisecondsPerFrame = 40;
  }
}
