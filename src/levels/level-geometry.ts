import {Rectangle} from '../core/geometry/rectangle';

export class LevelGeometry extends Rectangle{
  passable: boolean;
  killsYou: boolean;

  constructor(left: number = 0, top: number = 0, width: number = 0, height: number = 0, passable: boolean, killsYou: boolean) {
    super(left, top, width, height);
    this.passable = passable;
    this.killsYou = killsYou;
  }
}