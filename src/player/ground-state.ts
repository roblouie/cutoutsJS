import {Player} from './player';
import {GameControls} from '../scripts/game-controls';
import {State} from '../core/state-machine/state';
import {StateMachine} from '../core/state-machine/state-machine';

export class GroundState implements State {
  isAbleToJump: boolean;
  private player: Player;
  private stateMachine: StateMachine;

  constructor(player: Player) {
    this.player = player;
    this.stateMachine = player.stateMachine;
  }

  enter(...args: any[]) {
    console.log('Entering Ground State');
    this.isAbleToJump = !GameControls.Jump;
  }

  handleInput() {
    this.player.isRunning = GameControls.Sprint;
    this.player.movement.x = GameControls.LeftStick.X;
    if (GameControls.Left) {
      this.player.movement.x = -1.0;
    }

    if (GameControls.Right) {
      this.player.movement.x = 1.0;
    }

    if (GameControls.Duck) {
      this.stateMachine.change(Player.States.Ducking);
    }

    // when the user lets go of jump, reset their ability to jump
    if (!GameControls.Jump) {
      this.isAbleToJump = true;
    }

    if (GameControls.Jump && this.isAbleToJump) {
      this.stateMachine.change(Player.States.Jumping);
    }
  }

  update() {
    if (this.player.collisionState.isMyBottomColliding) {
      this.player.position.y += this.player.collisionState.collisionDepth.y;
      this.player.velocity.y = 0;
    }

    if (this.player.collisionState.isHorizontalCollision) {
      this.player.position.x += this.player.collisionState.collisionDepth.x;
      this.player.velocity.x = 0;
    }

    if (this.player.velocity.y > 0) {
      this.stateMachine.change(Player.States.Falling);
    }

    if (Math.abs(this.player.velocity.x) < 10) {
      this.player.setAnimationState(this.player.animationStates.standing);
    } else {
      this.player.setAnimationState(this.player.animationStates.moving);
    }
  }

  exit() {
  }
}