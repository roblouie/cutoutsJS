import {Player} from './player';
import {GameControls} from '../scripts/game-controls';
import {State} from '../core/state-machine/state';
import {StateMachine} from '../core/state-machine/state-machine';
import {gameEngine} from '../scripts/game-engine';

export class JumpingState implements State {
  player: Player;
  stateMachine: StateMachine;
  private isAbleToJump: boolean = true;
  private jumpTime: number = 0;
  private readonly jumpLaunchVelocity: number = -1100;
  private readonly maxJumpTime: number = 0.4;
  private readonly jumpControlPower: number = 2.0;

  constructor(player: Player) {
    this.player = player;
    this.stateMachine = player.stateMachine;
  }

  enter(...args: any[]) {
    console.log('Entered Jumping State');
    this.player.setAnimationState(this.player.animationStates.jumping);
    this.jump();
  }

  handleInput() {
    if (GameControls.Jump && this.isAbleToJump) {
      this.jump();
    }

    // If you let go of jump while jumping, you can't keep moving up
    if (!GameControls.Jump) {
      this.isAbleToJump = false;
    }

    this.player.isRunning = GameControls.Sprint;
    this.player.movement.x = GameControls.LeftStick.X;
    if (GameControls.Left) {
      this.player.movement.x = -1.0;
    }

    if (GameControls.Right) {
      this.player.movement.x = 1.0;
    }
  }

  update() {
    if (this.player.isStandingOnFloor) {
      this.stateMachine.change(Player.States.Ground);
    }
  }

  exit() {
    this.isAbleToJump = true;
    this.jumpTime = 0;
  }

  jump() {
    this.jumpTime += gameEngine.millisecondsSinceLast / 1000;

    if (this.jumpTime <= this.maxJumpTime) {
      this.player.velocity.y = this.jumpLaunchVelocity * (1 - Math.pow(this.jumpTime / this.maxJumpTime, this.jumpControlPower));
    }
  }
}