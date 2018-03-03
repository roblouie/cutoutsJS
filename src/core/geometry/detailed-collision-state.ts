import {Point} from './point';

export class DetailedCollisionState {
  isColliding: boolean = false;
  collisionDepth: Point = new Point();
  isMyTopColliding: boolean = false;
  isMyBottomColliding: boolean = false;
  isMyLeftColliding: boolean = false;
  isMyRightColliding: boolean = false;

  get isHorizontalCollision() {
    return this.isMyLeftColliding || this.isMyRightColliding;
  }

  get isVerticalCollision() {
    return this.isMyTopColliding || this.isMyBottomColliding;
  }
}