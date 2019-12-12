import {Point} from './geometry/point';
import {AnimationState} from './animation-state';
import {gameEngine} from "../scripts/game-engine";

export abstract class AnimatedSprite {
  protected spriteSheet: HTMLImageElement;
  protected millisecondsSinceLastFrame: number;
  protected isHorizontalFlipped: boolean = true;
  position: Point;
  millisecondsPerFrame: number;
  frameSize = {
    width: 0,
    height: 0
  };

  frameCounts: Point;
  currentFrame: Point;
  private currentAnimationState: AnimationState;

  constructor(frameWidth, frameHeight, frameCountX, frameCountY, spriteSheetSrc?: string) {
    this.frameSize.width = frameWidth;
    this.frameSize.height = frameHeight;
    this.frameCounts = new Point(frameCountX, frameCountY);
    this.position = new Point(0, 0);
    this.millisecondsSinceLastFrame = 0;
    this.currentAnimationState = new AnimationState(0, 0, this.frameCounts.x - 1, this.frameCounts.y - 1);
    this.currentFrame = new Point(this.currentAnimationState.startingFrame.x, this.currentAnimationState.startingFrame.y);

    if (spriteSheetSrc !== undefined) {
      this.setSpriteSheet(spriteSheetSrc);
    }
  }

  setSpriteSheet(spriteSheetSrc) {
    this.spriteSheet = new Image();
    this.spriteSheet.src = spriteSheetSrc;
  }

  protected updateAnimationFrame() {
    this.millisecondsSinceLastFrame += gameEngine.millisecondsSinceLast;

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

  setAnimationState(animationState: AnimationState) {
    if (animationState !== this.currentAnimationState) {
      this.currentAnimationState = animationState;
      this.currentFrame.x = animationState.startingFrame.x;
      this.currentFrame.y = animationState.startingFrame.y;
    }
  }

  protected gotoNextRow() {
    this.currentFrame.y++;

    if (this.currentFrame.y > this.currentAnimationState.endingFrame.y) {
      this.currentFrame.y = this.currentAnimationState.startingFrame.y;
    }
  }

  draw() {
    this.updateAnimationFrame();
    const sourceX = this.currentFrame.x * this.frameSize.width;
    const sourceY = this.currentFrame.y * this.frameSize.height;

    if (this.isHorizontalFlipped) {
      gameEngine.context.drawImage(this.spriteSheet,
        sourceX, sourceY, this.frameSize.width, this.frameSize.height,
        this.position.x, this.position.y, this.frameSize.width, this.frameSize.height);
    } else {
      gameEngine.context.save();
      gameEngine.context.translate(this.position.x, this.position.y);
      gameEngine.context.scale(-1, 1);
      gameEngine.context.drawImage(this.spriteSheet,
        sourceX, sourceY, this.frameSize.width, this.frameSize.height,
        this.frameSize.width * -1, 0, this.frameSize.width, this.frameSize.height);
      gameEngine.context.restore();
    }
  }
}
