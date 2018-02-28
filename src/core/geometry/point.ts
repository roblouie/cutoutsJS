export class Point {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  assign(point: Point) {
    this.x = point.x;
    this.y = point.y;
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }
}