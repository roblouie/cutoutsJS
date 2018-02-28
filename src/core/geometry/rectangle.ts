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

    return new Rectangle(left, top, width, height);
  }

  constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0) {
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

  get center(): Point {
    return new Point(this.left + this.width / 2, this.top + this.height / 2);
  }

  getIntersectionDepth(otherRectangle: Rectangle): Point {
    const halfWidthMe = this.width / 2;
    const halfWidthOther = otherRectangle.width / 2;
    const halfHeightMe = this.height / 2;
    const halfHeightOther = otherRectangle.height / 2;

    const centerMe = this.center;
    const centerOther = otherRectangle.center;

    const distanceX = centerMe.x - centerOther.x;
    const distanceY = centerMe.y - centerOther.y;
    const minDistanceX = halfWidthMe + halfWidthOther;
    const minDistanceY = halfHeightMe + halfHeightOther;

    // If we are not intersecting at all, return (0, 0).
    if (Math.abs(distanceX) >= minDistanceX || Math.abs(distanceY) >= minDistanceY)
      return new Point(0, 0);

    // Calculate and return intersection depths.
    const depthX = distanceX > 0 ? minDistanceX - distanceX : -minDistanceX - distanceX;
    const depthY = distanceY > 0 ? minDistanceY - distanceY : -minDistanceY - distanceY;
    return new Point(depthX, depthY);
  }
}