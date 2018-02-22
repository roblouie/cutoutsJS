import {Point} from './geometry/point';
import {AnimationState} from './animation-state';

export abstract class AnimatedSprite {
  protected spriteSheet: HTMLImageElement;
  protected millisecondsSinceLastFrame: number;
  position: Point;
  millisecondsPerFrame: number;
  frameSize = {
    width: 0,
    height: 0
  };

  frameCounts: Point;
  currentFrame: Point;
  currentAnimationState: AnimationState;

  constructor(frameWidth, frameHeight, frameCountX, frameCountY, spriteSheetSrc?: string) {
    this.frameSize.width = frameWidth;
    this.frameSize.height = frameHeight;
    this.frameCounts = new Point(frameCountX, frameCountY);
    this.position = new Point(0, 0);
    this.millisecondsSinceLastFrame = 0;
    this.currentAnimationState = new AnimationState(0, 0, this.frameCounts.x, this.frameCounts.y);
    this.currentFrame = new Point(this.currentAnimationState.startingFrame.x, this.currentAnimationState.startingFrame.y);

    if (spriteSheetSrc !== undefined) {
      this.setSpriteSheet(spriteSheetSrc);
    }
  }

  setSpriteSheet(spriteSheetSrc) {
    this.spriteSheet = new Image();
    this.spriteSheet.src = spriteSheetSrc;
  }

  protected update(millisecondsSinceLast: number) {
    this.millisecondsSinceLastFrame += millisecondsSinceLast;

    if (this.millisecondsSinceLastFrame > this.millisecondsPerFrame) {
      this.millisecondsSinceLastFrame = 0;

      this.currentFrame.x++;

      if (this.currentFrame.x === this.currentAnimationState.endingFrame.x) {
        this.currentFrame.x = this.currentAnimationState.startingFrame.x;
        this.gotoNextRow();
      }
    }

    console.log(this.currentFrame.x, this.currentFrame.y);
  }

  protected setAnimationState(animationState: AnimationState) {
    this.currentAnimationState = animationState;
    this.currentFrame.x = animationState.startingFrame.x;
    this.currentFrame.y = animationState.startingFrame.y;
  }

  protected gotoNextRow() {
    this.currentFrame.y++;

    if (this.currentFrame.y > this.currentAnimationState.endingFrame.y) {
      this.currentFrame.y = this.currentAnimationState.startingFrame.y;
    }
  }

  draw(context, millisecondsSinceLast) {
    this.update(millisecondsSinceLast);
    const sourceX = this.currentFrame.x * this.frameSize.width;
    const sourceY = this.currentFrame.y * this.frameSize.height;

    context.drawImage(this.spriteSheet,
      sourceX, sourceY, this.frameSize.width, this.frameSize.height,
      this.position.x, this.position.y, this.frameSize.width, this.frameSize.height);
  }
}