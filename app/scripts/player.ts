import controls from '../core/controls';
import {AnimatedSprite} from '../core/animated-sprite';
import {Point} from '../core/geometry/point';
import {MathHelper} from '../core/math-helper';
import {AnimationState} from '../core/animation-state';
import {Rectangle} from '../core/geometry/rectangle';

export class Player extends AnimatedSprite {
  private readonly groundDrag: number = 0.68;
  private readonly airDrag: number = 0.68;
  private readonly jumpLaunchVelocity: number = -1100;
  private readonly maxJumpTime: number = 0.4;
  private readonly jumpControlPower: number = 2.0;
  private readonly gravity: number = 4500;
  private readonly maxWalkSpeed: number = 12000;
  private readonly maxRunSpeed: number = 20000;
  private readonly maxVelocity: Point = new Point(2000, 1700);

  speed: number;
  analogSpeed: number;
  worldWidth: number;
  worldHeight: number;
  isHorizontalFlipped: boolean;
  private wantsToJump: boolean;
  private isJumping: boolean;
  private isJumpingAnimation: boolean; // NOTE: Required due to how jumping works. State management should be refactored.
  private isStanding: boolean;
  isDying: boolean;
  private _isFalling: boolean;
  private isDucking: boolean;
  private isGrabbing: boolean;
  private isRunning: boolean;
  private isOnGround: boolean;
  private isBouncingOffEnemy: boolean;
  private velocity: Point = new Point();
  private jumpTime: number;
  private movement: Point = new Point(0, 0);
  private previousBottom: number;
  private moveSpeed: number;

  private collisionOffsetTop: number = 15;
  private collisionOffsetX: number = 30;
  private collisionOffsetBottom: number = 20;

  private states = {
    moving: new AnimationState(1, 0, 3, 1),
    standing: new AnimationState(0, 0, 0, 0),
    ducking: new AnimationState(4, 1, 4, 1),
    jumping: new AnimationState(5, 1, 5, 1),
    deathState: new AnimationState(6, 1, 6, 1)
  };

  constructor(x, y, worldWidth, worldHeight) {
    super(102, 150, 9, 2, '../images/player/player.png');

    this.worldWidth = worldWidth;
    this.worldHeight = worldHeight;
    this.millisecondsPerFrame = 50;

    // (x, y) = center of object
    // ATTENTION:
    // it represents the player position on the world(room), not the canvas position
    this.position.x = x;
    this.position.y = y;

    // move speed in pixels per second
    this.speed = 0.5;
    this.analogSpeed = 20;

    this.setAnimationState(this.states.moving);
  }

  updateFromUserInput() {
    if (this.isDying) {
      return;
    }

    this.movement.x = controls.controller.leftStick.x;

    if (controls.keyboard.left || controls.controller.dpad.left) {
      this.movement.x = -1.0;
    }

    if (controls.keyboard.right || controls.controller.dpad.right) {
      this.movement.x = 1.0;
    }

    this.isDucking = controls.keyboard.down || controls.controller.dpad.down || controls.controller.leftStick.y > 0.2;
    this.wantsToJump = controls.keyboard.space || controls.controller.buttons.bottom;

    if (controls.keyboard.leftShift
      || controls.controller.buttons.left
      || controls.controller.buttons.rightBumper
      || controls.controller.triggers.right > 0) {
      this.isGrabbing = true;
      this.isRunning = true;
    } else {
      this.isGrabbing = false;
      this.isRunning = false;
    }
  }

  physics(millisecondsSinceLast, currentCollisionBoxes) {
    const playerCenter: number = this.position.x + this.frameSize.width / 2;

    if (this.isRunning) {
      this.moveSpeed += this.moveSpeed < this.maxRunSpeed ? 400 : 0;
    } else {
      this.moveSpeed = this.maxWalkSpeed;
    }

    const uncappedVelocityX = this.velocity.x + this.movement.x * this.moveSpeed * millisecondsSinceLast;
    const uncappedVelocityY = this.velocity.y + this.gravity * millisecondsSinceLast;
    this.velocity.x = MathHelper.Clamp(uncappedVelocityX, this.maxVelocity.x * -1, this.maxVelocity.x);
    this.velocity.y = MathHelper.Clamp(uncappedVelocityY, this.maxVelocity.y * -1, this.maxVelocity.y);

    if (Math.abs(this.velocity.x) > 800) {
      this.millisecondsPerFrame = 30;
    } else if (Math.abs(this.velocity.x) > 400) {
      this.millisecondsPerFrame = 40;
    } else {
      this.millisecondsPerFrame = 80;
    }

    this.jump(millisecondsSinceLast);

    if (this.isOnGround) {
      this.velocity.x *= this.groundDrag;
    } else {
      this.velocity.x *= this.airDrag;
    }

    this.isHorizontalFlipped = this.velocity.x >= 0;
    this._isFalling = this.velocity.y > 0;

    if (Math.abs(this.movement.x) < 0.1) {
      this.isStanding = true;
    } else {
      this.isStanding = false;
      this.isDucking = false;
    }

    this.position.x += this.velocity.x * millisecondsSinceLast;
    this.position.y += this.velocity.y * millisecondsSinceLast;

    // Player is considered "not on the ground" until collision detection proves otherwise
    this.isOnGround = false;

    currentCollisionBoxes.forEach(collisionItem => {
      const collisionBox = new Rectangle(collisionItem.collisionBox.x, collisionItem.collisionBox.y, collisionItem.collisionBox.width, collisionItem.collisionBox.height);
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
        this.isJumpingAnimation = false;
        this.position.y += depth.y;
        this.velocity.y = 0;
      }

      if (isVerticalCollision && isCollidingFromBelow && !collisionItem.passable) { // hitting head on the box
        this.position.y += depth.y;
        this.velocity.y = 0;
      }

      if (isHorizontalCollision && !collisionItem.passable) { // walking into a wall
        this.position.x += depth.x;
        this.velocity.x = 0;
        this.isStanding = true;
      }
    });
  }

  bounceOffEnemy() {
    this.isBouncingOffEnemy = true;
  }

  private jump(millisecondsSinceLast) {
    if (this.wantsToJump || this.isBouncingOffEnemy) {
      if ((!this.isJumping && this.isOnGround) || this.jumpTime > 0 || this.isBouncingOffEnemy) { // TODO: Clean up this logic
        this.jumpTime += millisecondsSinceLast;
        this.isJumping = true;
        this.isJumpingAnimation = true;
      }

      if (0 < this.jumpTime && this.jumpTime <= this.maxJumpTime) {
        this.velocity.y = this.jumpLaunchVelocity * (1 - Math.pow(this.jumpTime / this.maxJumpTime, this.jumpControlPower));
      } else {
        this.jumpTime = 0;
      }

      this.isBouncingOffEnemy = false;
    } else {
      this.jumpTime = 0;
    }

    // NOTE: This stops the user from being able to bounce repeatedly by holding the jump button.
    // Since isJumping will remain true jump won't trigger again until the user lets go of the button.
    // This works but isn't very intuitive.
    this.isJumping = this.wantsToJump;
  }

  updateAnimationState() {
    let newState: AnimationState;

    if (this.isStanding) {
      newState = this.states.standing;
    } else {
      newState = this.states.moving;
    }

    if (this.isDucking) {
      newState = this.states.ducking;
    }

    if (this.isJumpingAnimation) {
      newState = this.states.jumping;
    }

    this.setAnimationState(newState);
  }

  drawPlayer(context, millisecondsSinceLast, currentSectors) {
    this.updateFromUserInput();
    this.physics(millisecondsSinceLast / 1000, currentSectors);
    this.updateAnimationState();

    super.draw()
  }

  get isFalling() {
    return this._isFalling;
  }

  get collisionBox(): Rectangle {
    return new Rectangle(this.position.x + this.collisionOffsetX,
      this.position.y + this.collisionOffsetTop,
      this.frameSize.width - (this.collisionOffsetX * 2),
      this.frameSize.height - this.collisionOffsetBottom);
  }
}
