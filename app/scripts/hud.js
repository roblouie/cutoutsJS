'use strict';
import {Vector2} from './vector-2';

export class Hud {
    constructor(coinsImagePath, livesImagePath, coinsOffset, livesOffset) {
        this.coinsImage = new Image();
        this.coinsImage.src = coinsImagePath;
        this.livesImage = new Image();
        this.livesImage.src = livesImagePath;

        this.coinsOffset = coinsOffset;
        this.livesOffset = livesOffset;
    }

    draw(canvasContext) {
        canvasContext.drawImage(this.coinsImage, this.coinsOffset.x, this.coinsOffset.y);
        canvasContext.drawImage(this.livesImage, this.livesOffset.x, this.livesOffset.y);
    }
}