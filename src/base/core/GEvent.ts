import { IPoolObject } from "@base/BaseConst";
import PoolMgr from "@base/core/PoolMgr";

/**
 * 事件抛出所携带的结构，自定义数据通过data获取
 * @date 2024/6/18
 */
export class GEvent<T = any> implements IPoolObject {
  private _type: string;
  private _data: T;

  get type(): string {
    return this._type;
  }

  set type(value: string) {
    this._type = value;
  }

  get data(): T {
    return this._data;
  }

  set data(value: T) {
    this._data = value;
  }

  public static alloc<T>(type: string, data: T): GEvent<T> {
    const e = PoolMgr.alloc<GEvent<T>>(GEvent);
    e.type = type;
    e.data = data;
    return e;
  }

  onAlloc(): void {
    //
  }

  onRelease(): void {
    this.type = "";
    this.data = undefined;
  }
}
