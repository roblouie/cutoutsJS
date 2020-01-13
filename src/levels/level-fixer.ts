import defaultExport from './world-1/level-2';

export class LevelFixer {

  fix() {
    const level = {
      playableSectors: [],
      artFiles: [],
      backgroundFiles: [],
      hatPositions: []
    };

    const playableSectors = defaultExport.playableSectors;

    playableSectors.forEach(playableSector => {
      const newSector = {
        sectorRectangle: {},
        artPieces: [],
        enemyPositions: [],
        collectiblePositions: [],
        collisionBoxes: [],
      };
      const [left, top, width, height] = playableSector.SectorRec.split(" ").map(value => Number(value));

      newSector.sectorRectangle = {
        left,
        top,
        width,
        height,
      };

      newSector.artPieces = playableSector.artPieces.Item;

      if (Array.isArray(playableSector.collisionBoxes.Item)) {
        newSector.collisionBoxes = playableSector.collisionBoxes.Item;
      } else if (playableSector.collisionBoxes.Item !== undefined) {
        // For the single enemy object, we wrap it it in an array
        newSector.collisionBoxes.push(playableSector.collisionBoxes.Item);
      }

      if (Array.isArray(playableSector.enemyPositions.Item)) {
        newSector.enemyPositions = playableSector.enemyPositions.Item;
      } else if (playableSector.enemyPositions.Item !== undefined) {
        // For the single enemy object, we wrap it it in an array
        newSector.enemyPositions.push(playableSector.enemyPositions.Item);
      }

      if (playableSector.collectiblePositions === '' || playableSector.collectiblePositions === undefined) {
        newSector.collectiblePositions = [];
      } else {
        // Otherwise, split every other space so x/y coordinates are paired together, then split
        // those individually and build objects with x/y positions from them.
        const splitEveryOtherSpace = playableSector.collectiblePositions.match(/\b[\w']+(?:[^\w\n]+[\w']+)?\b/g);
        newSector.collectiblePositions = splitEveryOtherSpace.map(coordString => {
          const [x, y] = coordString.split(' ');
          return {x, y};
        });
      }

      level.playableSectors.push(newSector);
    });

    level.artFiles = defaultExport.artFiles;
    level.backgroundFiles = defaultExport.backgroundFiles;
    level.hatPositions = defaultExport.hatPositions;
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(level));
    var dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href",     dataStr     );
    dlAnchorElem.setAttribute("download", "scene.json");
    dlAnchorElem.click();
  }
}
