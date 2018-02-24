import { Point } from "../core/geometry/point";
import { SourceImage } from "../core/source-image";
import { AnimatedSprite } from "../core/animated-sprite";
import {Enemy} from "./enemy";
import {gameEngine} from '../scripts/game-engine';
import {MathHelper} from '../core/math-helper';
import {Rectangle} from '../core/geometry/rectangle';
import {createProject} from 'gulp-typescript';

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
    this.collisionOffsetLeft = 10;
    this.collisionOffsetRight = 17;
    this.collisionOffsetTop = 30;
    this.collisionOffsetBottom = 30;

    this.killOffsetLeft = 40;
    this.killOffsetRight = 70;
    this.killOffsetTop = 50;
    this.killOffsetBottom = 50;
  }

  update(currentSectors) {
    this.physicsAndCollision(currentSectors);
  }

  physicsAndCollision(currentSectors) {
    const elapsed = gameEngine.millisecondsSinceLast / 1000;
    this.currentScreen = gameEngine.canvas.width;
    this.velocity.x = MathHelper.Clamp(this.velocity.x + this.movement * this.moveSpeed * elapsed, -this.maxVelocity.x, this.maxVelocity.x);
    this.velocity.y = MathHelper.Clamp(this.velocity.y + this.gravity * elapsed, -this.maxVelocity.y, this.maxVelocity.y);

    if (this.isOnGround)
      this.velocity.x *= this.groundDrag;
    else
      this.velocity.x *= this.airDrag;

    this.isFacingLeft = this.velocity.x < 0;

    this.position.x += this.velocity.x * elapsed;
    this.position.y += this.velocity.y * elapsed;

    this.isOnGround = false;

    currentSectors.forEach(playableSector => {
      playableSector.collisionBoxes.Item.forEach(collisionItem => {
        const collisionBox = new Rectangle(collisionItem.collisionBox.x, collisionItem.collisionBox.y, collisionItem.collisionBox.width, collisionItem.collisionBox.height);

        const depth: Point = this.collisionBox.getIntersectionDepth(collisionBox);
        const absDepthX = Math.abs(depth.x);
        const absDepthY = Math.abs(depth.y);

        if (!depth.isZero()) { // ignore collision boxes we aren't colliding with
          if (absDepthY < absDepthX || collisionItem.passable) { // if enemey is colliding with floor or passable wall
            this.velocity.y = 0;    // stop their vertical motion

            // if enemy is above or at the same place as last frame they are on the ground
            this.isOnGround = collisionBox.bottom >= this.previousBottom;

            if (!collisionItem.passable || this.isOnGround) {  // if the floor is not passable or the enemy is on the ground
              this.position.y += depth.y;  // push them out of the ground
              this.velocity.y = 0;
            }
          } else if (!collisionItem.passable) { // enemy hit a non-passable wall
            this.position.x += depth.x; // so push them out of the wall
            this.movement *= -1; // and have them start walking in the opposite direction
          }
        }

        this.previousBottom = this.collisionBox.bottom;
      });
    });
  }

}
