export class ImageHelper {
  static ImageFromSource(source: string): HTMLImageElement {
    const image = new Image();
    image.src = source;
    return image;
  }
}
