'use strict';

export class Hud {
    constructor(coinsImagePath, livesImagePath, coinsOffset, livesOffset) {
        this.coinsImage = new Image();
        this.coinsImage.src = coinsImagePath;
        this.livesImage = new Image();
        this.livesImage.src = livesImagePath;

        this.coinsOffset = coinsOffset;
        this.livesOffset = livesOffset;
    }

    draw(canvasContext, cameraPosition) {
        canvasContext.drawImage(this.coinsImage, this.coinsOffset.x + cameraPosition, this.coinsOffset.y);
        canvasContext.drawImage(this.livesImage, this.livesOffset.x + cameraPosition, this.livesOffset.y);
    }
}