import {AnimatedSprite} from '../core/animated-sprite';
import {Point} from '../core/geometry/point';
import {MathHelper} from '../core/math-helper';
import {AnimationState} from '../core/animation-state';
import {Rectangle} from '../core/geometry/rectangle';
import {gameEngine} from '../scripts/game-engine';
import {GameControls} from "../scripts/game-controls";

enum PlayerStates {
  Standing,
  Moving,
  Ducking,
  Dying,
  Jumping
}

export class Player extends AnimatedSprite {
  private static SpriteSheet = require('./player.png');
  private readonly drag: number = 0.68;
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
  isDying: boolean;
  private _isFalling: boolean;
  private isRunning: boolean;
  private isInvincible: boolean;
  private isAbleToJump: boolean = true;
  private velocity: Point = new Point();
  private jumpTime: number = 0;
  private movement: Point = new Point(0, 0);
  private moveSpeed: number;

  private collisionOffsetTop: number = 15;
  private collisionOffsetX: number = 30;
  private collisionOffsetBottom: number = 20;

  private _lives: number = 3;
  private _coins: number = 0;
  private invincibilityTimeLimit: number = 2000;
  private invincibilityTime: number;

  private currentState: PlayerStates = PlayerStates.Standing;

  private animationStates = {
    moving: new AnimationState(1, 0, 3, 1),
    standing: new AnimationState(0, 0, 0, 0),
    ducking: new AnimationState(4, 1, 4, 1),
    jumping: new AnimationState(5, 1, 5, 1),
    deathState: new AnimationState(6, 1, 6, 1)
  };

  constructor(x, y, worldWidth, worldHeight) {
    super(102, 150, 9, 2, Player.SpriteSheet);

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

    this.setAnimationState(this.animationStates.standing);
  }

  updateFromUserInput() {
    if (this.isDying) {
      return;
    }

    switch (this.currentState) {
      case PlayerStates.Standing:
        this.movement.x = GameControls.LeftStick.X;
        if (GameControls.Left) {
          this.movement.x = -1.0;
        }

        if (GameControls.Right) {
          this.movement.x = 1.0;
        }

        if (Math.abs(this.movement.x) > 0) {
          this.currentState = PlayerStates.Moving;
          this.setAnimationState(this.animationStates.moving);
        }

        if (GameControls.Duck) {
          this.currentState = PlayerStates.Ducking;
          this.setAnimationState(this.animationStates.ducking);
        }

        if (GameControls.Jump) {
          this.currentState = PlayerStates.Jumping;
          this.setAnimationState(this.animationStates.jumping);
        } else {
          this.isAbleToJump = true;
        }
        break;
      case PlayerStates.Moving:
        this.movement.x = GameControls.LeftStick.X;
        if (GameControls.Left) {
          this.movement.x = -1.0;
        }

        if (GameControls.Right) {
          this.movement.x = 1.0;
        }

        if (Math.abs(this.movement.x) === 0) {
          this.currentState = PlayerStates.Standing;
          this.setAnimationState(this.animationStates.standing);
          break;
        }

        this.isRunning = GameControls.Sprint;

        if (Math.abs(this.velocity.x) > 800) {
          this.millisecondsPerFrame = 30;
        } else if (Math.abs(this.velocity.x) > 400) {
          this.millisecondsPerFrame = 40;
        } else {
          this.millisecondsPerFrame = 80;
        }

        if (GameControls.Jump) {
          this.currentState = PlayerStates.Jumping;
          this.setAnimationState(this.animationStates.jumping);
        } else {
          this.isAbleToJump = true;
        }
        break;
      case PlayerStates.Jumping:
        if (GameControls.Jump) {
          this.jump();
        }

        this.movement.x = GameControls.LeftStick.X;
        if (GameControls.Left) {
          this.movement.x = -1.0;
        }

        if (GameControls.Right) {
          this.movement.x = 1.0;
        }

        if(!GameControls.Jump) {
          this.jumpTime = 0;
          this.isAbleToJump = true;
        }

        this.isRunning = GameControls.Sprint;
        break;
      case PlayerStates.Ducking:
        if (!GameControls.Duck) {
          this.currentState = PlayerStates.Standing;
          this.setAnimationState(this.animationStates.standing);
        }

        if (GameControls.Jump) {
          this.jump();
          this.currentState = PlayerStates.Jumping;
          this.setAnimationState(this.animationStates.jumping);
        }
        break;
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
    this.velocity.x *= this.drag;

    this.isHorizontalFlipped = this.velocity.x >= 0;
    this._isFalling = this.velocity.y > 0;
    this.position.x += this.velocity.x * millisecondsSinceLast;
    this.position.y += this.velocity.y * millisecondsSinceLast;

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

      if (isVerticalCollision && isCollidingFromAbove && this.currentState !== PlayerStates.Jumping) { // standing on the box
        this.currentState = PlayerStates.Standing;
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
      }
    });
  }

  bounceOffEnemy() {
    this.isAbleToJump = true;
    this.jumpTime = 0;
    this.jump();
  }

  takeDamage() {
    if (!this.isInvincible) {
      this._lives--;
      this.setInvincible();
    }
  }

  setInvincible() {
    this.isInvincible = true;
    this.invincibilityTime = 0;
  }

  addCoin() {
    this._coins++;
    if (this._coins >= 100) {
      this._lives++;
      this._coins = 0;
    }
  }

  get coins(): number {
    return this._coins;
  }

  get lives(): number {
    return this._lives;
  }

  private jump() {
    this.jumpTime += gameEngine.millisecondsSinceLast / 1000;

    if (this.jumpTime <= this.maxJumpTime && this.isAbleToJump) {
      this.velocity.y = this.jumpLaunchVelocity * (1 - Math.pow(this.jumpTime / this.maxJumpTime, this.jumpControlPower));
    }
  }

  private updateInvincibility() {
    if (this.isInvincible) {
      this.invincibilityTime += gameEngine.millisecondsSinceLast;

      if (this.invincibilityTime >= this.invincibilityTimeLimit) {
        this.isInvincible = false;
        this.invincibilityTime = 0;
      }
    }
  }

  drawPlayer(context, millisecondsSinceLast, currentSectors) {
    this.updateFromUserInput();
    this.updateInvincibility();
    this.physics(millisecondsSinceLast / 1000, currentSectors);

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
