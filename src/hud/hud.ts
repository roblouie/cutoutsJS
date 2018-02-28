import {ImageHelper} from '../core/image-helper';
import {Point} from '../core/geometry/point';
import {gameEngine} from '../scripts/game-engine';

export class Hud {
  private coinImage: HTMLImageElement;
  private livesImage: HTMLImageElement;
  private coinsImageOffset: Point;
  private livesImageOffset: Point;
  private coinsTextOffset: Point;
  private livesTextOffset: Point;

  constructor() {
    this.coinImage = ImageHelper.ImageFromSource(require('./collectible.png'));
    this.livesImage = ImageHelper.ImageFromSource(require('./livesMarker.png'));
    this.livesImageOffset = new Point(20, 10);
    this.livesTextOffset = new Point(this.livesImageOffset.x + 65, 60);
    this.coinsImageOffset = new Point(1140, 10);
    this.coinsTextOffset = new Point(this.coinsImageOffset.x + 85, 60);
  }

  draw(playerCoins: number, playerLives: number) {
    gameEngine.context.drawImage(this.coinImage, this.coinsImageOffset.x + gameEngine.previousXPosition, this.coinsImageOffset.y);
    gameEngine.context.drawImage(this.livesImage, this.livesImageOffset.x + gameEngine.previousXPosition, this.livesImageOffset.y);

    gameEngine.context.fillStyle ='white';
    gameEngine.context.font = '30px sans-serif';
    gameEngine.context.fillText(playerCoins.toString(), this.coinsTextOffset.x + gameEngine.previousXPosition, this.coinsTextOffset.y);
    gameEngine.context.fillText(playerLives.toString(), this.livesTextOffset.x + gameEngine.previousXPosition, this.livesTextOffset.y);
  }
}