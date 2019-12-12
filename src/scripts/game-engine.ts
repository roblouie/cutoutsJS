import {Map} from '../levels/map';
import {CollisionResolver} from './collision-resolver';
import {Hud} from '../hud/hud';
import {Player} from '../player/player';
import controls from '../core/controls';

export class GameEngine {
  canvas: HTMLCanvasElement;
  previousXPosition: number = 0;
  millisecondsSinceLast: number = 0;
  map: Map;
  collisionResolver: CollisionResolver;
  hud: Hud;
  player: Player;
  running = true;

  private readonly _isDebugMode = false;
  private _context: CanvasRenderingContext2D;

  initialize(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this._context = this.canvas.getContext("2d");
    this.map = new Map();
    this.hud = new Hud();
    this.player = new Player(50, 50);
    this.collisionResolver = new CollisionResolver();
  }

  get context() {
    return this._context;}

  get isDebugMode() {
    return this._isDebugMode;
  }

  scrollCanvas(xPosition, mapWidth) {
    const playerOffset = this.canvas.width / 2;

    if (xPosition < playerOffset || xPosition + playerOffset > mapWidth) {
      return;
    }

    const newPosition = this.previousXPosition - xPosition + playerOffset;
    this._context.translate(newPosition, 0);
    this.previousXPosition = xPosition - playerOffset;
  }

  update() {
    // Handle pause/unpause of game
    // TODO: Fix so it only pauses once, not flashes and animates
    if (controls.controller.buttons.start || controls.keyboard.p) {
      this.running = !this.running;
    }

    if (this.running) {
      this.player.update(gameEngine.millisecondsSinceLast, this.map.getCurrentCollisionBoxes());
      this.collisionResolver.checkCollision(this.map.currentSectors, this.player);
    }
  }

  draw() {
    this.map.draw(this.previousXPosition);
    this.player.draw();
    this.scrollCanvas(this.player.position.x, this.map.width);
    this.hud.draw(this.player.coins, this.player.lives);
  }
}

export const gameEngine = new GameEngine();
