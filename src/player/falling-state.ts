import {Player} from './player';
import {GameControls} from '../scripts/game-controls';
import {State} from '../core/state-machine/state';
import {StateMachine} from '../core/state-machine/state-machine';

export class FallingState implements State {
  private player: Player;
  private stateMachine: StateMachine;

  constructor(player: Player) {
    this.player = player;
    this.stateMachine = player.stateMachine;
  }

  enter(...args: any[]) {
    console.log('Entered Falling State');
  }

  update() {
    console.log(this.player.isStandingOnFloor);

    if (this.player.isStandingOnFloor) {
      this.stateMachine.change(Player.States.Ground);
    }

    if (Math.abs(this.player.velocity.x) < 10) {
      this.player.setAnimationState(this.player.animationStates.standing);
    } else {
      this.player.setAnimationState(this.player.animationStates.moving);
    }
  }

  handleInput() {
    this.player.movement.x = GameControls.LeftStick.X;
    if (GameControls.Left) {
      this.player.movement.x = -1.0;
    }

    if (GameControls.Right) {
      this.player.movement.x = 1.0;
    }

    this.player.isRunning = GameControls.Sprint;
  }

  exit() {
  }
}