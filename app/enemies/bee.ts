import { Point } from "../core/geometry/point";
import {Enemy} from "./enemy";
import {gameEngine} from '../scripts/game-engine';
import {MathHelper} from '../core/math-helper';
import {Rectangle} from '../core/geometry/rectangle';

export class Bee extends Enemy {
  private static AnimationData = {
    frameWidth: 192,
    frameHeight: 158,
    columns: 6,
    rows: 1,
    imageSource: '../images/enemies/bee.png'
  };
  private velocity = new Point();
  private maxVelocity = new Point(1000, 300);

  private movement = 1;


  private enemyCenter;


  private moveSpeed = 600;

  constructor(x, y) {
    super(x, y, Bee.AnimationData.frameWidth, Bee.AnimationData.frameHeight,
      Bee.AnimationData.columns, Bee.AnimationData.rows, Bee.AnimationData.imageSource);

    this.millisecondsPerFrame = 25;
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

    this.velocity.y = MathHelper.Clamp(this.velocity.y + this.movement * this.moveSpeed * elapsed, -this.maxVelocity.y, this.maxVelocity.y);
    this.position.y += this.velocity.y * elapsed;

    if (this.position.y < 70 && this.movement < 0) {
      this.movement = 1;
    } else if (this.position.y > 500 && this.movement > 0) {
      this.movement = -1;
    }

    currentCollisionBoxes.forEach(collisionItem => {
      const collisionBox = new Rectangle(collisionItem.collisionBox.x, collisionItem.collisionBox.y, collisionItem.collisionBox.width, collisionItem.collisionBox.height);
      const depth = this.collisionBox.getIntersectionDepth(collisionBox);

      if (depth.isZero()) { // Stop if we aren't colliding with the current box
        return;
      }

      const isVerticalCollision = Math.abs(depth.y) < Math.abs(depth.x);
      const isCollidingFromAbove = this.collisionBox.bottom <= collisionBox.bottom;
      const isCollidingFromBelow = !isCollidingFromAbove;

      if (isVerticalCollision && isCollidingFromAbove) { // landing on the box
        this.position.y += depth.y;
        this.velocity.y = 0;
        this.movement = -1;
      }

      if (isVerticalCollision && isCollidingFromBelow && !collisionItem.passable) { // hitting head on the box
        this.position.y += depth.y;
        this.movement = 1;
      }
    });
  }

  draw() {
    super.draw();
    if (gameEngine.isDebugMode) {
      gameEngine.context.fillStyle = 'red';
      gameEngine.context.fillText(this.position.x.toString(), this.position.x, this.position.y);
      gameEngine.context.fillRect(this.collisionBox.left, this.collisionBox.top, this.collisionBox.width, this.collisionBox.height);
    }
  }
}
