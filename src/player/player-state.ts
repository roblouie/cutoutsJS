import {Player} from './player';

export interface PlayerState {
  getInput(player: Player): void;
  onWallHit(player: Player): void;
  onGroundHit(player: Player): void;
}