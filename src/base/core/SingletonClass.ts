/**
 * 单例模式基类
 */
export default class SingletonClass {
  private static _instance: SingletonClass;

  /**
   * 获取实例
   */
  public static ins(): any {
    if (!this._instance) {
      this._instance = new this(); // 单例模式，这里要用this指引当前类（子类）
    }
    return this._instance;
  }
}
