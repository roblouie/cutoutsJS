import { Point } from "../core/geometry/point";
import {Enemy} from "./enemy";
import {gameEngine} from '../scripts/game-engine';
import {MathHelper} from '../core/math-helper';

export class GroundCrawler extends Enemy {
  private static AnimationData = {
    frameWidth: 125,
    frameHeight: 90,
    columns: 3,
    rows: 1,
    imageSource: require('./ground-crawler.png')
  };

  private isOnGround: boolean;
  private readonly groundDrag = 0.68;
  private readonly airDrag = 0.65;
  private readonly gravity = 500;
  private readonly moveSpeed = 1000;
  private movement = -1;

  velocity = new Point();
  maxVelocity = new Point(1000, 500);

  constructor(x, y) {
    super(x, y, GroundCrawler.AnimationData.frameWidth, GroundCrawler.AnimationData.frameHeight,
      GroundCrawler.AnimationData.columns, GroundCrawler.AnimationData.rows, 'Ground Crawler', GroundCrawler.AnimationData.imageSource);

    this.millisecondsPerFrame = 250;
    this.collisionOffsetLeft = 10;
    this.collisionOffsetRight = 17;
    this.collisionOffsetTop = 30;
    this.collisionOffsetBottom = 30;

    this.killOffsetLeft = 40;
    this.killOffsetRight = 70;
    this.killOffsetTop = 50;
    this.killOffsetBottom = 50;
  }

  update(currentCollisionBoxes) {
    this.physicsAndCollision(currentCollisionBoxes);
  }

  physicsAndCollision(currentCollisionBoxes) {
    const elapsed = gameEngine.millisecondsSinceLast / 1000;
    this.velocity.x = MathHelper.Clamp(this.velocity.x + this.movement * this.moveSpeed * elapsed, -this.maxVelocity.x, this.maxVelocity.x);
    this.velocity.y = MathHelper.Clamp(this.velocity.y + this.gravity * elapsed, -this.maxVelocity.y, this.maxVelocity.y);

    if (this.isOnGround)
      this.velocity.x *= this.groundDrag;
    else
      this.velocity.x *= this.airDrag;

    this.isHorizontalFlipped = this.velocity.x < 0;

    this.position.x += this.velocity.x * elapsed;
    this.position.y += this.velocity.y * elapsed;

    this.isOnGround = false;

    currentCollisionBoxes.forEach(collisionBox => {
      const depth: Point = this.collisionBox.getIntersectionDepth(collisionBox);

      if (depth.isZero()) { // ignore collision boxes we aren't colliding with
       return;
      }

      const isVerticalCollision = Math.abs(depth.y) < Math.abs(depth.x);
      const isHorizontalCollision = !isVerticalCollision;
      const isCollidingFromAbove = this.collisionBox.bottom <= collisionBox.bottom;

      if (isVerticalCollision && isCollidingFromAbove) { // standing on the box
        this.isOnGround = true;
        this.position.y += depth.y;
        this.velocity.y = 0;
      }

      if (isHorizontalCollision && !collisionBox.passable) { // walking into a wall
        this.position.x += depth.x;
        this.movement *= -1;
      }
    });
  }
}
