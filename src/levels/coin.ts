import {Point} from '../core/geometry/point';
import {Rectangle} from '../core/geometry/rectangle';
import {gameEngine} from '../scripts/game-engine';
import {ImageHelper} from '../core/image-helper';

export class Coin {
  private static CoinImage = ImageHelper.ImageFromSource(require('./coin.png'));
  position: Point;
  private size: number = 56;
  private collisionRectangle: Rectangle;

  constructor(x: number, y: number) {
    this.position = new Point(x, y);
    this.collisionRectangle = new Rectangle(x, y, this.size, this.size);
  }

  draw() {
    gameEngine.context.drawImage(Coin.CoinImage, this.position.x, this.position.y);

    if (gameEngine.isDebugMode) {
     this.drawDebug();
    }
  }

  get collisionBox(): Rectangle {
    return this.collisionRectangle
  }

  private drawDebug() {
    gameEngine.context.fillStyle = 'yellow';
    gameEngine.context.fillRect(this.position.x, this.position.y, this.size, this.size);
  }
}
