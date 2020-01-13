import defaultExport from './world-1/level-2';
import {gameEngine} from '../scripts/game-engine';
import {PlayableSector} from './playable-sector';
import {Enemy} from '../enemies/enemy';

export class Map {
  width: number;
  height: number;
  previousX: number;
  currentSectors: any[];
  private levelData;
  private artFiles: any[];
  private backgroundFiles: any[];
  private artImageElements;
  private backgrounds;

  constructor(height?: number) {
    this.height = height || 720;
    this.previousX = 0;
    this.load();
    this.currentSectors = [];
  }

  load() {
    this.levelData = defaultExport;
    this.artFiles = this.levelData.artFiles;
    this.backgroundFiles = this.levelData.backgroundFiles;
    this.width = this.levelData.playableSectors.length * 1280;

    this.levelData.playableSectors.forEach((playableSector, index, playableSectors) => {
      playableSectors[index] = new PlayableSector(playableSector);
    });

    this.loadArtFiles();
  }

  // draw the map adjusted to camera
  draw(cameraPosition) {
    this.backgrounds.forEach(background => {
      const distanceMoved = cameraPosition - this.previousX;
      background.xPos += distanceMoved * background.speed;

      if (background.right < cameraPosition) {
        background.xPos += background.width * 2;
      }

      gameEngine.context.drawImage(background.image, background.xPos, 0);
    });

    this.populateCurrentSectors(cameraPosition);

    this.currentSectors.forEach(playableSector => {
      this.drawLevelForeground(playableSector);
      this.drawCoins(playableSector);
      this.drawEnemies(playableSector);

      if (gameEngine.isDebugMode) {
        this.drawDebug(playableSector);
      }

    });
    this.previousX = cameraPosition;
  }

  private drawLevelForeground(playableSector) {
    const artArray = playableSector.artPieces;
    artArray.forEach(element => {
      const imageIndex = element.type;
      const image = this.artImageElements[imageIndex];
      gameEngine.context.drawImage(image, element.position.x, element.position.y);
    });
  }

  private drawCoins(playableSector) {
    playableSector.coins.forEach(coin => coin.draw());
  }

  private drawEnemies(playableSector) {
    playableSector.enemies.forEach((enemy, index) => {
      if (enemy.centerScreenIndex > enemy.ownedScreen) {
        const oldScreen = enemy.ownedScreen;
        this.moveEnemyForward(enemy, index);
        console.log(`Enemy ${enemy.type} changed screens from ${oldScreen} to ${enemy.ownedScreen}`)
      }

      if (enemy.centerScreenIndex < enemy.ownedScreen) {
        const oldScreen = enemy.ownedScreen;
        this.moveEnemyBackwards(enemy, index);
        console.log(`Enemy ${enemy.type} changed screens from ${oldScreen} to ${enemy.ownedScreen}`)
      }

      enemy.update(this.getCurrentCollisionBoxes());
      enemy.draw();
    });
  }

  private moveEnemyForward(enemy: Enemy, enemyIndex: number) {
    this.updateEnemyScreen(enemy, enemyIndex, enemy.ownedScreen + 1);
  }

  private moveEnemyBackwards(enemy: Enemy, enemyIndex: number) {
    this.updateEnemyScreen(enemy, enemyIndex, enemy.ownedScreen - 1);
  }

  private updateEnemyScreen(enemy: Enemy, enemyIndex: number, destinationScreenIndex: number) {
    this.levelData.playableSectors[enemy.ownedScreen].removeEnemyAt(enemyIndex);
    enemy.ownedScreen = destinationScreenIndex;
    if (destinationScreenIndex < this.levelData.playableSectors.length)
    {
      this.levelData.playableSectors[destinationScreenIndex].addEnemy(enemy);
    }
  }

  private populateCurrentSectors(cameraPosition) {
    const currentSector = Math.round(cameraPosition / 1280);
    this.currentSectors = [this.levelData.playableSectors[currentSector]];
    if (currentSector > 0) {
      this.currentSectors.push(this.levelData.playableSectors[currentSector - 1]);
    }

    if (currentSector < this.levelData.playableSectors.length - 1) {
      this.currentSectors.push(this.levelData.playableSectors[currentSector + 1]);
    }
  }

  loadArtFiles() {
    this.artImageElements = [];
    this.backgrounds = [];

    this.artFiles.forEach(file => {
      const artImage = new Image();
      artImage.src = require(`./world-1/images/${file}.png`);
      this.artImageElements.push(artImage);
    });

    const imageSourceOne = require(`./world-1/images/${this.backgroundFiles[0]}.png`);
    const imageSourceTwo = require(`./world-1/images/${this.backgroundFiles[1]}.png`);
    const imageSourceThree = require(`./world-1/images/${this.backgroundFiles[2]}.png`);
    const imageSourceFour = require(`./world-1/images/${this.backgroundFiles[3]}.png`);
    this.backgrounds.push(new BackgroundLayer(imageSourceOne, 0, 1280, 1));
    this.backgrounds.push(new BackgroundLayer(imageSourceTwo, 0, 1280, 0.7));
    this.backgrounds.push(new BackgroundLayer(imageSourceTwo, 1280, 1280, 0.7));
    this.backgrounds.push(new BackgroundLayer(imageSourceThree, 0, 1280, 0.5));
    this.backgrounds.push(new BackgroundLayer(imageSourceThree, 1280, 1280, 0.5));
    this.backgrounds.push(new BackgroundLayer(imageSourceFour, 0, 1280, 0.3));
    this.backgrounds.push(new BackgroundLayer(imageSourceFour, 1280, 1280, 0.3));

    console.log(this.artFiles);
  }

  getCurrentCollisionBoxes() {
    return this.currentSectors.reduce((previous, current) => {
      return previous.concat(current.collisionBoxes);
    }, []);
  }

  drawDebug(playableSector) {
    playableSector.collisionBoxes.forEach(collisionBox => {
      if (collisionBox.passable) {
        gameEngine.context.fillStyle = 'green';
      } else if (collisionBox.killsYou) {
        gameEngine.context.fillStyle = 'red';
      } else {
        gameEngine.context.fillStyle = 'blue';
      }
      gameEngine.context.fillRect(collisionBox.left, collisionBox.top, collisionBox.width, collisionBox.height);
    });
  }
}

class BackgroundLayer {
  private image: HTMLImageElement;
  private xPos: number;
  private width: number;
  private speed: number;

  constructor(imageSource, xPos, width, speed) {
    const image = new Image();
    image.src = imageSource;
    this.image = image;
    this.xPos = xPos;
    this.width = width;
    this.speed = speed;
  }

  get right() {
    return this.xPos + this.width;
  }
}
