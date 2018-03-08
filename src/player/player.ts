import {AnimatedSprite} from '../core/animated-sprite';
import {Point} from '../core/geometry/point';
import {MathHelper} from '../core/math-helper';
import {AnimationState} from '../core/animation-state';
import {Rectangle} from '../core/geometry/rectangle';
import {gameEngine} from '../scripts/game-engine';
import {FallingState} from './falling-state';
import {GroundState} from './ground-state';
import {JumpingState} from './jumping-state';
import {StateMachine} from '../core/state-machine/state-machine';
import {DuckingState} from './ducking-state';
import {DetailedCollisionState} from '../core/geometry/detailed-collision-state';
import {CollisionResolver} from '../scripts/collision-resolver';

export class Player extends AnimatedSprite {
  private static SpriteSheet = require('./player.png');
  private readonly drag: number = 0.68;

  private readonly gravity: number = 4500;
  private readonly maxWalkSpeed: number = 12000;
  private readonly maxRunSpeed: number = 20000;
  private readonly maxVelocity: Point = new Point(2000, 1700);

  speed: number;
  analogSpeed: number;
  isDying: boolean;
  private _isFalling: boolean;
  isRunning: boolean;
  private isInvincible: boolean;
  velocity: Point = new Point();
  collisionState = new DetailedCollisionState();

  movement: Point = new Point(0, 0);
  private moveSpeed: number;

  private collisionOffsetTop: number = 15;
  private collisionOffsetX: number = 30;
  private collisionOffsetBottom: number = 20;

  private _lives: number = 3;
  private _coins: number = 0;
  private invincibilityTimeLimit: number = 2000;
  private invincibilityTime: number;
  private collisionResolver = new CollisionResolver();

  static States = {
    Ground: 'Ground',
    Jumping: 'Jumping',
    Falling: 'Falling',
    Ducking: 'Ducking'
  };

  stateMachine: StateMachine = new StateMachine();

  animationStates = {
    moving: new AnimationState(1, 0, 3, 1),
    standing: new AnimationState(0, 0, 0, 0),
    ducking: new AnimationState(4, 1, 4, 1),
    jumping: new AnimationState(5, 1, 5, 1),
    deathState: new AnimationState(6, 1, 6, 1)
  };

  constructor(x, y) {
    super(102, 150, 9, 2, Player.SpriteSheet);

    this.millisecondsPerFrame = 50;

    this.position.x = x;
    this.position.y = y;

    // move speed in pixels per second
    this.speed = 0.5;
    this.analogSpeed = 20;

    this.stateMachine.add(Player.States.Falling, new FallingState(this));
    this.stateMachine.add(Player.States.Ground, new GroundState(this));
    this.stateMachine.add(Player.States.Jumping, new JumpingState(this));
    this.stateMachine.add(Player.States.Ducking, new DuckingState(this));

    this.stateMachine.change(Player.States.Falling);
    this.setAnimationState(this.animationStates.standing);
  }

  physics() {
    const millisecondsSinceLast = gameEngine.millisecondsSinceLast / 1000;
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

    if (Math.abs(this.velocity.x) > 800) {
      this.millisecondsPerFrame = 30;
    } else if (Math.abs(this.velocity.x) > 400) {
      this.millisecondsPerFrame = 40;
    } else {
      this.millisecondsPerFrame = 80;
    }

    this.isHorizontalFlipped = this.velocity.x >= 0;
    this._isFalling = this.velocity.y > 0;
    this.position.x += this.velocity.x * millisecondsSinceLast;
    this.position.y += this.velocity.y * millisecondsSinceLast;
  }

  bounceOffEnemy() {
    this.stateMachine.change(Player.States.Jumping);
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


  private updateInvincibility() {
    if (this.isInvincible) {
      this.invincibilityTime += gameEngine.millisecondsSinceLast;

      if (this.invincibilityTime >= this.invincibilityTimeLimit) {
        this.isInvincible = false;
        this.invincibilityTime = 0;
      }
    }
  }

  update(millisecondsSinceLast, currentSectors) {
    this.stateMachine.handleInput();
    this.physics();
    this.collisionResolver.handlePlayerLevelGeometryCollision(this, currentSectors);
    this.stateMachine.update();
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
