import { emitter } from "@base/MessageMgr";

type VoidFunc = (...args: any) => void;

/**
 * @author zpj
 * @date 2025/4/28
 */
export class BaseEmitter {
  private _messageObj: { [event: string]: [VoidFunc, any][] } = {};

  public emit(event: string, args?: any): void {
    emitter.emit(event, args);
  }

  public on(event: string, method: VoidFunc, caller?: any, args?: any): void {
    if (!this._messageObj[event]) {
      this._messageObj[event] = [];
    }
    for (const item of this._messageObj[event]) {
      if (item[0] === method && item[1] === caller) {
        return;
      }
    }
    this._messageObj[event].push([method, caller || this]);

    emitter.on(event, method, caller || this, args);
  }

  public off(event: string, method: VoidFunc, caller?: any): void {
    if (!this._messageObj[event]) return;
    const list = this._messageObj[event];
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item[0] === method && item[1] === (caller || this)) {
        list.splice(i, 1);
        break;
      }
    }
    if (!list.length) {
      this._messageObj[event] = undefined;
      delete this._messageObj[event];
    }
    emitter.off(event, method, caller || this);
  }

  // 移除此对象上的某事件
  public offAllEvent(event: string, caller?: any): void {
    emitter.offListCaller(event, caller || this);
  }

  // 移除此对象上的事件
  public offAllCaller(caller?: any): void {
    for (const evt in this._messageObj) {
      emitter.offListCaller(evt, caller || this);
    }
  }
}
