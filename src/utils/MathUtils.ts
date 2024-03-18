export class MathUtils {
  /**随机整数*/
  public static getRandom(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
