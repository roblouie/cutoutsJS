export class SourceImage {
  image: HTMLImageElement;

  constructor(imageSource) {
    this.image = new Image();
    this.image.src = imageSource;
  }
}
