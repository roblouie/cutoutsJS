import controls from '../core/controls';
import {AnimatedSprite} from '../core/animated-sprite';
import {Point} from '../core/geometry/point';

export class Player extends AnimatedSprite {
  private readonly groundDrag: number = 0.68;
  private readonly airDrag: number = 0.68;
  private readonly jumpLaunchVelocity: number = -1100;
  private readonly maxJumpTime: number = 0.4;
  private readonly jumpControlPower: number = 2.0;
  private readonly gravity: number = 4500;
  private readonly moveSpeed: number = 14000;
  private readonly maxVelocity: Point = new Point(2000, 1700);

    speed: number;
    analogSpeed: number;
    worldWidth: number;
    worldHeight: number;
    isFacingLeft: boolean;

  private wantsToJump: boolean;
  private isJumping: boolean;
  private isDying: boolean;
  private isOnGround: boolean;
  private velocity: Point = new Point();
  private jumpTime: number;



    runningFramesStart: Point = new Point(0, 0);
    runningFramesEnd: Point = new Point(3, 1);
    duckingFrame: Point = new Point(4, 1);
    jumpingFrame: Point = new Point(5, 1);
    deathFrame: Point = new Point(6,1);


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
    }

    update(millisecondsSinceLast){
      this.millisecondsSinceLastFrame += millisecondsSinceLast;

      if (this.millisecondsSinceLastFrame > this.millisecondsPerFrame) {
        this.millisecondsSinceLastFrame = 0;

        this.currentFrame.x++;

        if (this.currentFrame.x === this.frameCounts.x) {
          this.currentFrame.x = 0;
          this.gotoNextRow();
        }
      }

      this.updateFromUserInput(millisecondsSinceLast);

    }

    updateFromUserInput(millisecondsSinceLast) {
      if (this.isDying) {
        return;
      }

      if(controls.left) {
        this.position.x -= this.speed * millisecondsSinceLast;
        this.isFacingLeft = true;
      }

      if(controls.up)
        this.position.y -= this.speed * millisecondsSinceLast;
      if(controls.right) {
        this.position.x += this.speed * millisecondsSinceLast;
        this.isFacingLeft = false;
      }

      if(controls.down)
        this.position.y += this.speed * millisecondsSinceLast;

      if(controls.leftStick.x) {
        this.position.x += controls.leftStick.x * this.analogSpeed;
      }

      if (controls.leftStick.y) {
        this.position.y += controls.leftStick.y * this.analogSpeed;
      }

      if (controls.leftStick.y > 0) {
        this.currentFrame.x = this.duckingFrame.x;
        this.currentFrame.y = this.duckingFrame.y;
      }

      // don't let player leaves the world's boundary
      if(this.position.x - this.frameSize.width/2 < 0){
        this.position.x = this.frameSize.width/2;
      }
      if(this.position.y - this.frameSize.height/2 < 0){
        this.position.y = this.frameSize.height/2;
      }
      if(this.position.x + this.frameSize.width/2 > this.worldWidth){
        this.position.x = this.worldWidth - this.frameSize.width/2;
      }
      if(this.position.y + this.frameSize.height/2 > this.worldHeight){
        this.position.y = this.worldHeight - this.frameSize.height/2;
      }
    }

    drawPlayer(context, millisecondsSinceLast, xView, yView) {
      this.update(millisecondsSinceLast);

      const sourceX = this.currentFrame.x * this.frameSize.width;
      const sourceY = this.currentFrame.y * this.frameSize.height;
      const destX = (this.position.x - this.frameSize.width / 2) - xView;
      const destY = (this.position.y - this.frameSize.height / 2) - yView;

      if (this.isFacingLeft) {
        context.save();
        context.translate(destX, destY);
        context.scale(-1, 1);
        context.drawImage(this.spriteSheet,
          sourceX, sourceY, this.frameSize.width, this.frameSize.height,
          this.frameSize.width * -1, 0, this.frameSize.width, this.frameSize.height);
        context.restore();
      } else {
        context.drawImage(this.spriteSheet,
          sourceX, sourceY, this.frameSize.width, this.frameSize.height,
          destX, destY, this.frameSize.width, this.frameSize.height);
      }
    }
}
