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
    this.loadEnemies(playableSectorRaw.enemyPositions.Item);
    this.loadCollisionRectangles(playableSectorRaw.collisionBoxes.Item);
    this.loadSectorRectangle(playableSectorRaw.SectorRec);
    this.artPieces = playableSectorRaw.artPieces.Item;
  }

  addEnemy(enemy: Enemy) {
    this.enemies.push(enemy);
  }

  removeEnemyAt(index: number) {
    this.enemies.splice(index, 1);
  }

  // xml to json conversion renders this as a stirn with x, y, width, and height separated by space
  private loadSectorRectangle(sectorRecRaw: string) {
    const [left, top, width, height] = sectorRecRaw.split(" ").map(value => Number(value));
    this.sectorRectangle = new Rectangle(left, top, width, height)
  }

  private loadCollisionRectangles(collisionItems) {
    this.collisionBoxes = collisionItems.map(collisionItem => {
      return new LevelGeometry(collisionItem.collisionBox.x, collisionItem.collisionBox.y, collisionItem.collisionBox.width, collisionItem.collisionBox.height, collisionItem.passable, collisionItem.killsYou);
    });
    console.log(this.collisionBoxes);
  }

  private loadCoins(collectibleRaw) {
    // If the string is empty, there are no collectibles in this sector, set to empty array
    if (collectibleRaw === '') {
      this.coins = [];
    } else {
      // Otherwise, split every other space so x/y coordinates are paired together, then split
      // those individually and build objects with x/y positions from them.
      const splitEveryOtherSpace = collectibleRaw.match(/\b[\w']+(?:[^\w\n]+[\w']+)?\b/g);
      this.coins = splitEveryOtherSpace.map(coordString => {
        const [x, y] = coordString.split(' ');
        return new Coin(Number(x), Number(y));
      });
    }
  }

  private loadEnemies(enemyDataRaw) {
    if (Array.isArray(enemyDataRaw)) {
      // For the list of enemy positions we convert them into enemy objects of the right type
      this.enemies = enemyDataRaw.map(enemy => {
        return this.getEnemyFromEnemyPosition(enemy);
      });
    } else if (enemyDataRaw !== undefined) {
      // For the single enemy object, we wrap it it in an array
      this.enemies.push(this.getEnemyFromEnemyPosition(enemyDataRaw));
    }
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