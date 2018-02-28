import {Point} from './geometry/point';

export class AnimationState {
  startingFrame: Point;
  endingFrame: Point;

  constructor(startingFrameX: number, startingFrameY: number, endingFrameX: number, endingFrameY: number);
  constructor(startingFrame: Point, endingFrame: Point);
  constructor(firstArg: Point | number, secondArg: Point | number, thirdArg?: number, fourthArg?: number) {
    if (typeof firstArg === 'number' && typeof secondArg === 'number') {
      this.startingFrame = new Point(firstArg, secondArg);
      this.endingFrame = new Point(thirdArg, fourthArg);
    } else {
      this.startingFrame = <Point>firstArg;
      this.endingFrame = <Point>secondArg;
    }
  }
}