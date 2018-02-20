import { Point } from './point';

export class Rectangle {
  top: number;
  left: number;
  width: number;
  height: number;

  static fromPoints(pointA: Point, pointB: Point) {
    const top = pointA.y < pointB.y ? pointA.y : pointB.y;
    const left = pointA.x < pointB.x ? pointA.x : pointB.x;
    const width = Math.abs(pointA.x - pointB.x);
    const height = Math.abs(pointA.y - pointB.y);

    return new Rectangle(top, left, width, height);
  }

  constructor(top: number = 0, left: number = 0, width: number = 0, height: number = 0) {
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height;
  }

  get right() {
    return this.left + this.width;
  }

  get bottom() {
    return this.top + this.height;
  }

  isIntersecting(otherRectangle: Rectangle): boolean {
    return otherRectangle.left < this.right && otherRectangle.right > this.left &&
      otherRectangle.top < this.bottom && otherRectangle.bottom > this.top;
  }
}