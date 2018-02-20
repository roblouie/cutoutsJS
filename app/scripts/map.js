'use strict';

import defaultExport from '../level-data/world-1/level-2';

export class Map {
    constructor(width, height) {
        // map dimensions
        this.width = width;
        this.height = height || 720;
        this.previousX = 0;
        this.load();
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
    }

    // draw the map adjusted to camera
    draw(context, xView, yView) {
        // easiest way: draw the entire map changing only the destination coordinate in canvas
        // canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
      this.backgrounds.forEach(background => {
        const distanceMoved = xView - this.previousX;
        background.xPos -= distanceMoved * background.speed;

        if (background.right < 0) {
          background.xPos += background.width * 2;
        }

        context.drawImage(background.image, background.xPos, 0);
      });

        this.levelData.playableSectors.forEach(playableSector => {
          const artArray = playableSector.artPieces.Item;
          artArray.forEach(element => {
            const imageIndex = element.type;
            const image = this.artImageElements[imageIndex];
            context.drawImage(image, element.position.x - xView, element.position.y - yView);
          });
        });

        this.previousX = xView;
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
      this.backgrounds.push(new BackgroundLayer(imageSourceOne, 0, 1280, 0));
      this.backgrounds.push(new BackgroundLayer(imageSourceTwo, 0, 1280, 0.3));
      this.backgrounds.push(new BackgroundLayer(imageSourceTwo, 1280, 1280, 0.3));
      this.backgrounds.push(new BackgroundLayer(imageSourceThree, 0, 1280, 0.5));
      this.backgrounds.push(new BackgroundLayer(imageSourceThree, 1280, 1280, 0.5));
      this.backgrounds.push(new BackgroundLayer(imageSourceFour, 0, 1280, 0.7));
      this.backgrounds.push(new BackgroundLayer(imageSourceFour, 1280, 1280, 0.7));

      console.log(this.artFiles);
    }

}

class BackgroundLayer {
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