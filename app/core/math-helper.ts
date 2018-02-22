export class MathHelper {

  static clamp(number: number, min: number, max: number) {
    return Math.min(Math.max(number, min), max);
  }
}