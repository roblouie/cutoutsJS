import { Enemy } from '../enemies/enemy';
import { Coin } from '../levels/coin';
import { Player } from '../player/player';
import {Rectangle} from '../core/geometry/rectangle';
import {DetailedCollisionState} from '../core/geometry/detailed-collision-state';

export class CollisionResolver {

  constructor() {}

  checkCollision(currentSectors: any, player: Player) {
    if (currentSectors.length > 0) {
      this.handlePlayerCoinCollision(player, currentSectors[0].coins);
      this.handlePlayerEnemyCollision(player, currentSectors[0].enemies);
    }
  }

  private handlePlayerCoinCollision(player: Player, coins: Coin[]) {
    coins.forEach((coin: Coin, index: number, coinArray: Coin[]) => {
      if (player.collisionBox.isIntersecting(coin.collisionBox)) {
        coinArray.splice(index, 1);
        player.addCoin();
      }
    });
  }

  private handlePlayerEnemyCollision(player: Player, enemies) {
    enemies.forEach((enemy: Enemy, index, enemyArray) => {
      const isPlayerEnemyCollision = player.collisionBox.isIntersecting(enemy.collisionBox) && !player.isDying;
      const isPlayerJumpingOnHead = player.isFalling && player.collisionBox.bottom < enemy.collisionBox.center.y;
      const isPlayerInKillZone = player.collisionBox.isIntersecting(enemy.killBox);
      if (isPlayerEnemyCollision && isPlayerJumpingOnHead) {
        enemyArray.splice(index, 1);
        player.bounceOffEnemy();
        player.addCoin();
      }

      if (isPlayerEnemyCollision && !isPlayerJumpingOnHead && isPlayerInKillZone) {
        player.takeDamage();
      }
    });
  }

  handlePlayerLevelGeometryCollision(player: Player, levelGeometry) {
    player.collisionState.clear();

    levelGeometry.forEach(collisionItem => {
      const newCollisionState = this.getEnvironmentCollisionState(player, collisionItem);
      player.collisionState.updateState(newCollisionState);
    });
  }

  private getEnvironmentCollisionState(player: Player, levelPiece) {
    const collisionBox = new Rectangle(levelPiece.collisionBox.x, levelPiece.collisionBox.y, levelPiece.collisionBox.width, levelPiece.collisionBox.height);

    const depth = player.collisionBox.getIntersectionDepth(collisionBox);
    const collisionState = new DetailedCollisionState();

    if (!depth.isZero()) {
      const isVerticalCollision = Math.abs(depth.y) < Math.abs(depth.x);
      const isHorizontalCollision = !isVerticalCollision;

      collisionState.collisionDepth = depth;
      collisionState.isMyBottomColliding = isVerticalCollision && player.collisionBox.bottom <= collisionBox.bottom;
      collisionState.isMyTopColliding = isVerticalCollision && player.collisionBox.bottom > collisionBox.bottom && !levelPiece.passable;
      collisionState.isHorizontalCollision = isHorizontalCollision && !levelPiece.passable;
    }

    return collisionState;
  }
}