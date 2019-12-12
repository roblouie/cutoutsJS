import {Point} from './point';

export class DetailedCollisionState {
  collisionDepth: Point = new Point();
  isMyTopColliding: boolean = false;
  isMyBottomColliding: boolean = false;
  isHorizontalCollision: boolean = false;

  get isColliding() {
    return !this.collisionDepth.isZero();
  }

  get isVerticalCollision() {
    return this.isMyTopColliding || this.isMyBottomColliding;
  }

  clear() {
    this.collisionDepth = new Point();
    this.isMyTopColliding = false;
    this.isMyBottomColliding = false;
    this.isHorizontalCollision = false;
  }

  updateState(newDetailedCollisionState: DetailedCollisionState) {
    if (!newDetailedCollisionState.isColliding) {
      return;
    }

    if (newDetailedCollisionState.isHorizontalCollision && Math.abs(newDetailedCollisionState.collisionDepth.x) > Math.abs(this.collisionDepth.x)) {
      this.collisionDepth.x = newDetailedCollisionState.collisionDepth.x;
    }

    if (newDetailedCollisionState.isVerticalCollision && Math.abs(newDetailedCollisionState.collisionDepth.y) > Math.abs(this.collisionDepth.y)) {
      this.collisionDepth.y = newDetailedCollisionState.collisionDepth.y;
    }

    if (!this.isMyTopColliding) {
      this.isMyTopColliding = newDetailedCollisionState.isMyTopColliding;
    }

    if (!this.isMyBottomColliding) {
      this.isMyBottomColliding = newDetailedCollisionState.isMyBottomColliding;
    }

    if (!this.isHorizontalCollision) {
      this.isHorizontalCollision = newDetailedCollisionState.isHorizontalCollision;
    }
  }
}