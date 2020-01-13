import {Rectangle} from '../core/geometry/rectangle';
import {Enemy} from '../enemies/enemy';
import {Coin} from './coin';
import {GroundCrawler} from '../enemies/ground-crawler';
import {Bee} from '../enemies/bee';
import {Rabbit} from '../enemies/rabbit';
import {LevelGeometry} from './level-geometry';

export class PlayableSector {
  sectorRectangle: Rectangle;
  artPieces = [];
  collisionBoxes: LevelGeometry[] = [];
  enemies: Enemy[] = [];
  coins: Coin[] = [];

  constructor(playableSectorRaw) {
    this.loadCoins(playableSectorRaw.collectiblePositions);
    this.loadEnemies(playableSectorRaw.enemyPositions);
    this.loadCollisionRectangles(playableSectorRaw.collisionBoxes);
    this.loadSectorRectangle(playableSectorRaw.sectorRectangle);
    this.artPieces = playableSectorRaw.artPieces;
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  removeEnemyAt(index: number) {
    this.enemies.splice(index, 1);
  }

  private loadSectorRectangle(sectorRec) {
    this.sectorRectangle = new Rectangle(sectorRec.left, sectorRec.top, sectorRec.width, sectorRec.height)
  }

  private loadCollisionRectangles(collisionItems) {
    this.collisionBoxes = collisionItems.map(collisionItem => {
      return new LevelGeometry(collisionItem.collisionBox.x, collisionItem.collisionBox.y, collisionItem.collisionBox.width, collisionItem.collisionBox.height, collisionItem.passable, collisionItem.killsYou);
    });
    console.log(this.collisionBoxes);
  }

  private loadCoins(collectiblePositions) {
    this.coins = collectiblePositions.map(coinPos => new Coin(coinPos.x, coinPos.y));
  }

  private loadEnemies(enemyDataRaw) {
    this.enemies = enemyDataRaw.map(this.getEnemyFromEnemyPosition);
  }

  private getEnemyFromEnemyPosition(enemyPosition): Enemy {
    let enemy: Enemy;
    switch(enemyPosition.enemyType) {
      case 'Rabbit':
        enemy = new Rabbit(enemyPosition.position.x, enemyPosition.position.y);
        break;
      case 'GroundCrawler':
        enemy = new GroundCrawler(enemyPosition.position.x, enemyPosition.position.y);
        break;
      case 'Bee':
        enemy = new Bee(enemyPosition.position.x, enemyPosition.position.y);
        break;
    }
    return enemy;
  }
}
