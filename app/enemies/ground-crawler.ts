import { Point } from "../core/geometry/point";
import { SourceImage } from "../core/source-image";
import { AnimatedSprite } from "../core/animated-sprite";
import {Enemy} from "./enemy";

export class GroundCrawler extends Enemy {
  private static AnimationData = {
    frameWidth: 125,
    frameHeight: 90,
    columns: 3,
    rows: 1,
    imageSource: '../images/enemies/ground-crawler.png'
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
    super(x, y, GroundCrawler.AnimationData.frameWidth, GroundCrawler.AnimationData.frameHeight,
      GroundCrawler.AnimationData.columns, GroundCrawler.AnimationData.rows, GroundCrawler.AnimationData.imageSource);

    this.millisecondsPerFrame = 250;
  }
}
