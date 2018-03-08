import {Player} from './player';
import {StateMachine} from '../core/state-machine/state-machine';
import {State} from '../core/state-machine/state';
import {GameControls} from '../scripts/game-controls';

export class DuckingState implements State{
  private player: Player;
  private stateMachine: StateMachine;
  private isAbleToJump: boolean;

  constructor(player: Player) {
    this.player = player;
    this.stateMachine = player.stateMachine;
  }

  enter(...args: any[]) {
    console.log('Entering Ducking State');
    this.player.setAnimationState(this.player.animationStates.ducking);
    this.isAbleToJump = !GameControls.Jump;
  }

  handleInput() {
    if (!GameControls.Duck) {
      this.stateMachine.change(Player.States.Ground)
    }

    if (GameControls.Jump && this.isAbleToJump) {
      this.stateMachine.change(Player.States.Jumping);
    }
  }

  update() {
    if (this.player.collisionState.isVerticalCollision) {
      this.player.velocity.y = 0;
      this.player.position.y += this.player.collisionState.collisionDepth.y;
    }
  }

  exit() {
    console.log('Exiting Ducking State')
  }

}