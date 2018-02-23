import defaultExport from '../level-data/world-1/level-2';
import {gameEngine} from '../scripts/game-engine';
import {Coin} from './coin';
import {GroundCrawler} from "../enemies/ground-crawler";
import {Enemy} from "../enemies/enemy";
import {Rabbit} from "../enemies/rabbit";
import {Bee} from "../enemies/bee";

export class Map {
  width: number;
  height: number;
  previousX: number;
  currentSectors: any[];
  collectibles: any[];
  private isDebug: boolean;
  private levelData;
  private artFiles: any[];
  private backgroundFiles: any[];
  private firstScreen;
  private artImageElements;
  private backgrounds;
  private collectibleImage: HTMLImageElement;

  constructor(height?: number) {
    this.height = height || 720;
    this.previousX = 0;
    this.load();
    this.currentSectors = [];
    this.collectibleImage = new Image();
    this.collectibleImage.src = '../images/coin.png';
  }

  load() {
    this.levelData = defaultExport;
    this.artFiles = this.levelData.artFiles;
    this.backgroundFiles = this.levelData.backgroundFiles;
    this.firstScreen = this.levelData.playableSectors[0].artPieces.Item;
    this.width = this.levelData.playableSectors.length * 1280;
    console.log(this.firstScreen);
    console.log(this.artFiles);
    this.loadArtFiles();
    this.loadCoins();
    this.loadEnemies();
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
    const artArray = playableSector.artPieces.Item;
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
    playableSector.enemies.forEach(enemy => enemy.draw());
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
      artImage.src = `../images/${file}.png`;
      this.artImageElements.push(artImage);
    });

    const imageSourceOne = `../images/${this.backgroundFiles[0]}.png`;
    const imageSourceTwo = `../images/${this.backgroundFiles[1]}.png`;
    const imageSourceThree = `../images/${this.backgroundFiles[2]}.png`;
    const imageSourceFour = `../images/${this.backgroundFiles[3]}.png`;
    this.backgrounds.push(new BackgroundLayer(imageSourceOne, 0, 1280, 1));
    this.backgrounds.push(new BackgroundLayer(imageSourceTwo, 0, 1280, 0.7));
    this.backgrounds.push(new BackgroundLayer(imageSourceTwo, 1280, 1280, 0.7));
    this.backgrounds.push(new BackgroundLayer(imageSourceThree, 0, 1280, 0.5));
    this.backgrounds.push(new BackgroundLayer(imageSourceThree, 1280, 1280, 0.5));
    this.backgrounds.push(new BackgroundLayer(imageSourceFour, 0, 1280, 0.3));
    this.backgrounds.push(new BackgroundLayer(imageSourceFour, 1280, 1280, 0.3));

    console.log(this.artFiles);
  }

  drawDebug(playableSector) {
    const collisionArray = playableSector.collisionBoxes.Item;
    collisionArray.forEach(collisionItem => {
      const collisionBox = collisionItem.collisionBox;
      if (collisionItem.passable) {
        gameEngine.context.fillStyle = 'green';
      } else if (collisionItem.killsYou) {
        gameEngine.context.fillStyle = 'red';
      } else {
        gameEngine.context.fillStyle = 'blue';
      }
      gameEngine.context.fillRect(collisionBox.x, collisionBox.y, collisionBox.width, collisionBox.height);
    });
  }

  private loadCoins() {
    this.levelData.playableSectors.forEach(playableSector => {
      // The microsoft xml to json results in the locations all being one giant string instead of a collection
      // of x/y coordinates, so the string is parsed out into x/y coordinates and the resulting object array
      // is set as a new coins property of the sector.
      const collectibleRaw = playableSector.collectiblePositions;

      // If the string is empty, there are no collectibles in this sector, set to empty array
      if (collectibleRaw === '') {
        playableSector.coins = [];
      } else {
        // Otherwise, split every other space so x/y coordinates are paired together, then split
        // those individually and build objects with x/y positions from them.
        const splitEveryOtherSpace = collectibleRaw.match(/\b[\w']+(?:[^\w\n]+[\w']+)?\b/g);
        playableSector.coins = splitEveryOtherSpace.map(coordString => {
          const [x, y] = coordString.split(' ');
          return new Coin(Number(x), Number(y));
        });
      }
    });
  }

  private loadEnemies() {
    this.levelData.playableSectors.forEach(playableSector => {
      // The microsoft xml to json results in the enemy positions being either undefined
      // a list of enemies, or a single enemy.
      const enemyDataRaw = playableSector.enemyPositions.Item;

      playableSector.enemies = new Array<Enemy>();

     if (Array.isArray(enemyDataRaw)) {
        // For the list of enemy positions we convert them into enemy objects of the right type
        playableSector.enemies = enemyDataRaw.map(enemy => {
          return this.getEnemyFromEnemyPosition(enemy);
        });
      } else if (enemyDataRaw !== undefined) {
        // For the single enemy object, we wrap it it in an array
        playableSector.enemies.push(this.getEnemyFromEnemyPosition(enemyDataRaw));
      }
    });
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
