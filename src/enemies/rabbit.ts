import { Point } from "../core/geometry/point";
import {Enemy} from "./enemy";
import {AnimationState} from '../core/animation-state';
import {gameEngine} from '../scripts/game-engine';
import {MathHelper} from '../core/math-helper';

export class Rabbit extends Enemy {
  private static AnimationData = {
    frameWidth: 130,
    frameHeight: 120,
    columns: 5,
    rows: 1,
    imageSource: require('./rabbit.png')
  };

  private isOnGround: boolean;
  private startJump: boolean;
  private drag: number = 0.9;
  private jumpLaunchVelocity: number = -2000;
  private maxJumpTime: number = 0.45;
  private jumpControlPower = 0.14;
  private gravity = 500;
  private moveSpeed = 1800;

  private velocity = new Point();
  private maxVelocity = new Point(1300, 500);

  private movement: number = -1;
  private jumpTime: number;

  private jumpingState = new AnimationState(0, 0, 4, 0);
  private midairState = new AnimationState(4, 0, 4, 0);

  constructor(x, y) {
    super(x, y, Rabbit.AnimationData.frameWidth, Rabbit.AnimationData.frameHeight,
      Rabbit.AnimationData.columns, Rabbit.AnimationData.rows, 'Rabbit', Rabbit.AnimationData.imageSource);

    this.millisecondsPerFrame = 40;
    this.collisionOffsetLeft = 10;
    this.collisionOffsetRight = 17;
    this.collisionOffsetTop = 30;
    this.collisionOffsetBottom = 50;

    this.killOffsetLeft = 40;
    this.killOffsetRight = 70;
    this.killOffsetTop = 50;
    this.killOffsetBottom = 50;
  }
  
  update(currentCollisionBoxes) {
    this.physicsAndCollision(currentCollisionBoxes);
    this.updateAnimationState();
  }

  updateAnimationState() {
    if (this.isOnGround) {
      this.setAnimationState(this.jumpingState);
    } else if (this.currentFrame.x >= this.jumpingState.endingFrame.x) {
      // only switch to the midair state when the jumping state has finished animating
      this.setAnimationState(this.midairState);
    }
  }
  
  physicsAndCollision(currentCollisionBoxes) {
    const elapsed = gameEngine.millisecondsSinceLast / 1000;

    this.velocity.x = MathHelper.Clamp(this.velocity.x + this.movement * this.moveSpeed * elapsed, -this.maxVelocity.x, this.maxVelocity.x);
    this.velocity.y = MathHelper.Clamp(this.velocity.y + this.gravity * elapsed, -this.maxVelocity.y, this.maxVelocity.y);

    this.jump(elapsed);

    this.velocity.x *= this.drag;
    this.isHorizontalFlipped = this.velocity.x < 0;

    this.position.x += this.velocity.x * elapsed;
    this.position.y += this.velocity.y * elapsed;

    this.isOnGround = false;

    currentCollisionBoxes.forEach(collisionBox => {
      const depth = this.collisionBox.getIntersectionDepth(collisionBox);

      if (depth.isZero()) { // Stop if we aren't colliding with the current box
        return;
      }

      const isVerticalCollision = Math.abs(depth.y) < Math.abs(depth.x);
      const isHorizontalCollision = !isVerticalCollision;
      const isCollidingFromAbove = this.collisionBox.bottom <= collisionBox.bottom;
      const isCollidingFromBelow = !isCollidingFromAbove;

      if (isVerticalCollision && isCollidingFromAbove) { // standing on the box
        this.isOnGround = true;
        this.startJump = true;
        this.position.y += depth.y;
        this.velocity.y = 0;
      }

      if (isVerticalCollision && isCollidingFromBelow && !collisionBox.passable) { // hitting head on the box
        this.position.y += depth.y;
        this.velocity.y = 0;
      }

      if (isHorizontalCollision && !collisionBox.passable) { // walking into a wall
        this.position.x += depth.x;
        this.movement *= -1;
      }
    });
  }

  jump(elapsed) {
    if (this.isOnGround || this.jumpTime > 0) {
      this.jumpTime += elapsed;
    }

    if (0.0 < this.jumpTime && this.jumpTime <= this.maxJumpTime){
      this.velocity.y = this.jumpLaunchVelocity * (1.0 - Math.pow(this.jumpTime / this.maxJumpTime, this.jumpControlPower));
    } else {
      this.jumpTime = 0.0;
    }
  }
}
