import SingletonClass from "./SingletonClass";
import { GameUtils } from "../utils/GameUtils";

const MAX_SIZE = 50;

/**
 * 对象池
 * 对于需要频繁创建实例的，使用对象池可以节省性能开销
 */
export default class PoolMgr extends SingletonClass {
  private static _poolMap: { [key: string]: any[] } = {};

  public static ins: () => PoolMgr;

  /**
   * @param cls
   * @param args
   */
  public static alloc<T>(cls: new (...params: any[]) => T, ...args: any[]): T {
    const className = GameUtils.getQualifiedClassName(cls);
    if (!this._poolMap[className]) {
      this._poolMap[className] = [];
    }

    const list: any[] = this._poolMap[className];
    if (list.length) {
      const vo = list.pop();
      if (vo["onAlloc"] && typeof vo["onAlloc"] == "function") {
        vo["onAlloc"]();
      }
      return vo;
    }

    const clazz: any = new cls(...args);
    // 若是此对象实现了 IPoolObject 接口，则需要调用对应的 onAlloc 方法
    if (clazz["onAlloc"] && typeof clazz["onAlloc"] == "function") {
      clazz["onAlloc"]();
    }
    clazz.ObjectPoolKey = className;
    return clazz;
  }

  /**
   * 放入一个对象
   * @param obj
   */
  public static release(obj: any): boolean {
    if (!obj) {
      return false;
    }
    const refKey: any = obj.ObjectPoolKey;
    // 保证只有对象池中取出来的对象才可以放进来（已经清除的无法放入）
    if (
      !refKey ||
      !this._poolMap[refKey] ||
      this._poolMap[refKey].indexOf(obj) > -1
    ) {
      return false;
    }
    // 若是此对象实现了 IPoolObject 接口，则需要调用对应的 onRelease 方法
    if (obj["onRelease"] && typeof obj["onRelease"] == "function") {
      obj["onRelease"]();
    }
    this._poolMap[refKey].push(obj);
    if (this._poolMap[refKey].length > MAX_SIZE) {
      // 超出容量，销毁多余的（最旧的或未被频繁使用的）对象
      const firstObj = this._poolMap[refKey].shift();
      if (firstObj && firstObj["destroy"]) {
        firstObj["destroy"]();
      }
    }
    return true;
  }

  public static clear(): void {
    this._poolMap = {};
  }

  public static setCount(count = MAX_SIZE): void {
    for (const key in this._poolMap) {
      const list: any[] = this._poolMap[key];
      if (list.length > count) {
        list.length = count;
      }
    }
  }
}
