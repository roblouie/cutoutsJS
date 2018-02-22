import controls from '../core/controls';
import {AnimatedSprite} from '../core/animated-sprite';
import {Point} from '../core/geometry/point';
import {MathHelper} from '../core/math-helper';
import {AnimationState} from '../core/animation-state';
import {Rectangle} from '../core/geometry/rectangle';
import {gameEngine} from './game-engine';

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
    isFacingLeft: boolean;

  private wantsToJump: boolean;
  private isJumping: boolean;
  private isJumpingAnimation: boolean; // NOTE: Required due to how jumping works. State management should be refactored.
  private isStanding: boolean;
  private isDying: boolean;
  private isFalling: boolean;
  private isDucking: boolean;
  private isGrabbing: boolean;
  private isRunning: boolean;
  private isOnGround: boolean;
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

    constructor(x, y, worldWidth, worldHeight){
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

        this.currentAnimationState = this.states.moving;
    }

    update(millisecondsSinceLast){
      this.millisecondsSinceLastFrame += millisecondsSinceLast;

      if (this.millisecondsSinceLastFrame > this.millisecondsPerFrame) {
        this.millisecondsSinceLastFrame = 0;

        this.currentFrame.x++;
        const isOnLastRow = this.currentAnimationState.endingFrame.y === this.currentFrame.y;
        const finalXPos = isOnLastRow ? this.currentAnimationState.endingFrame.x : (this.frameCounts.x - 1);

        if (this.currentFrame.x > finalXPos) {
          this.currentFrame.x = this.currentAnimationState.startingFrame.x;
          this.gotoNextRow();
        }
      }
    }

    updateFromUserInput() {
      if (this.isDying) {
        return;
      }

      this.movement.x = controls.controller.leftStick.x;

      if(controls.keyboard.left || controls.controller.dpad.left) {
        this.movement.x = -1.0;
      }

      if(controls.keyboard.right || controls.controller.dpad.right) {
        this.movement.x = 1.0;
      }

      this.isDucking = controls.keyboard.down || controls.controller.dpad.down || controls.controller.leftStick.y > 0.2;
      this.wantsToJump = controls.keyboard.space || controls.controller.buttons.bottom;

      if (controls.keyboard.leftControl
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

    physics(millisecondsSinceLast, currentSectors) {
      const playerCenter: number = this.position.x + this.frameSize.width / 2;

      if (this.isRunning) {
        this.moveSpeed += this.moveSpeed < this.maxRunSpeed ? 400 : 0;
      } else {
        this.moveSpeed = this.maxWalkSpeed;
      }

      const uncappedVelocityX = this.velocity.x + this.movement.x * this.moveSpeed * millisecondsSinceLast;
      const uncappedVelocityY = this.velocity.y + this.gravity * millisecondsSinceLast;
      this.velocity.x = MathHelper.clamp(uncappedVelocityX, this.maxVelocity.x * -1, this.maxVelocity.x);
      this.velocity.y = MathHelper.clamp(uncappedVelocityY, this.maxVelocity.y * -1, this.maxVelocity.y);

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

      this.isFacingLeft = this.velocity.x < 0;
      this.isFalling = this.velocity.y  > 0;

      if(Math.abs(this.movement.x) < 0.1) {
        this.isStanding = true;
      } else {
        this.isStanding = false;
        this.isDucking = false;
      }

      this.position.x += this.velocity.x * millisecondsSinceLast;
      this.position.y += this.velocity.y * millisecondsSinceLast;

      // Player is considered "not on the ground" until collision detection proves otherwise
      this.isOnGround = false;

      currentSectors.forEach(playableSector => {
        playableSector.collisionBoxes.Item.forEach(collisionItem => {
          const collisionBox = new Rectangle(collisionItem.collisionBox.x, collisionItem.collisionBox.y, collisionItem.collisionBox.width, collisionItem.collisionBox.height);

          const depth = this.collisionBox.getIntersectionDepth(collisionBox);
          if (!depth.isZero()) {
            const absDepthX = Math.abs(depth.x);
            const absDepthY = Math.abs(depth.y);

            if (absDepthY < absDepthX || collisionItem.passable == true) {

              if (this.previousBottom <= collisionBox.bottom) {
                this.isOnGround = true;
                this.isJumpingAnimation = false;
              }

              if (!collisionItem.passable || this.isOnGround) {
                this.position.y += depth.y;
                this.velocity.y = 0;
              }
            } else if (collisionItem.passable == false) {
              this.position.x += depth.x;
              if (absDepthY > absDepthX) {
                this.isStanding = true;
              } else {
                this.velocity.y = 0;
              }
            }
          }
        });
      });

      this.previousBottom = this.collisionBox.bottom;
    }

    private jump(millisecondsSinceLast) {
      if(this.wantsToJump) {
        if ((!this.isJumping && this.isOnGround) || this.jumpTime > 0) {
          this.jumpTime += millisecondsSinceLast;
          this.isJumping = true;
          this.isJumpingAnimation = true;
        }

        if (0 < this.jumpTime && this.jumpTime <= this.maxJumpTime) {
          this.velocity.y = this.jumpLaunchVelocity * (1 - Math.pow(this.jumpTime / this.maxJumpTime, this.jumpControlPower));
        } else {
          this.jumpTime = 0;
        }

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

      if (newState !== this.currentAnimationState) {
        this.currentAnimationState = newState;
        this.currentFrame.assign(newState.startingFrame);
      }
    }

    drawPlayer(context, millisecondsSinceLast, currentSectors) {
      this.update(millisecondsSinceLast);
      this.updateFromUserInput();
      this.physics(millisecondsSinceLast / 1000, currentSectors);
      this.updateAnimationState();

      const sourceX = this.currentFrame.x * this.frameSize.width;
      const sourceY = this.currentFrame.y * this.frameSize.height;

      if (this.isFacingLeft) {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.scale(-1, 1);
        context.drawImage(this.spriteSheet,
          sourceX, sourceY, this.frameSize.width, this.frameSize.height,
          this.frameSize.width * -1, 0, this.frameSize.width, this.frameSize.height);
        context.restore();
      } else {
        context.drawImage(this.spriteSheet,
          sourceX, sourceY, this.frameSize.width, this.frameSize.height,
          this.position.x, this.position.y, this.frameSize.width, this.frameSize.height);
      }
      if (gameEngine.isDebugMode) {
        context.fillStyle = 'cyan';
        context.fillRect(this.collisionBox.left, this.collisionBox.top, this.collisionBox.width, this.collisionBox.height);
      }
    }

    get collisionBox(): Rectangle {
      return new Rectangle(this.position.x + this.collisionOffsetX,
        this.position.y + this.collisionOffsetTop,
      this.frameSize.width - (this.collisionOffsetX * 2),
      this.frameSize.height - this.collisionOffsetBottom);
    }
}
