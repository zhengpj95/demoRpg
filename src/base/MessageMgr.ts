import SingletonClass from "./core/SingletonClass";
import { DebugMgr } from "@base/DebugMgr";
import { GEvent } from "@base/core/GEvent";
import PoolMgr from "@base/core/PoolMgr";
import Handler = Laya.Handler;

type VoidFunc = (...args: any) => void;

// 全局事件管理器
export let emitter: MessageMgr;

export function initEmitter(): void {
  emitter = MessageMgr.ins();
  DebugMgr.ins().debug("emitter", emitter);
}

/**
 * 信息管理器
 * subscribe-publish pattern 订阅发布模式
 * @date 2024/4/11
 */
class MessageMgr extends SingletonClass {
  private _messages: { [key: string]: Handler[] } = {};

  public static ins: () => MessageMgr;

  private createListener(caller: any, method: VoidFunc, args?: any[]): Handler {
    return Handler.create(caller, method, args, false);
  }

  /**
   * 订阅信息
   * @param event 唯一key
   * @param method 回调函数
   * @param caller 回调函数对象
   * @param args 携带的参数
   */
  public on(event: string, method: VoidFunc, caller: any, args?: any[]): void {
    if (!this._messages[event]) {
      this._messages[event] = [];
    }
    const list: Handler[] = this._messages[event];
    for (const handler of list) {
      if (handler && handler.method === method && handler.caller === caller) {
        return;
      }
    }
    this._messages[event].push(this.createListener(caller, method, args));
  }

  /**
   * 订阅一次信息
   * @param event
   * @param method
   * @param caller
   * @param args
   */
  public once(
    event: string,
    method: VoidFunc,
    caller: any,
    args?: any[],
  ): void {
    const wrapper = (...args: any[]): void => {
      this.off(event, wrapper, caller);
      method.apply(caller, args);
    };
    this.on(event, wrapper, caller, args);
  }

  /**
   * 移除订阅信息
   * @param event 唯一key
   * @param method 移除的回调函数
   * @param caller 移除的回调函数对象
   */
  public off(event: string, method: VoidFunc, caller: any): void {
    const list = this._messages[event];
    if (!list || !list.length) {
      return;
    }
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item && item.method === method && item.caller === caller) {
        list[i].recover();
        list[i] = null;
        break;
      }
    }
  }

  /**
   * 发布信息
   * @param event 唯一key
   * @param args 参数
   */
  public emit(event: string, args?: any): void {
    const list = this._messages[event];
    if (!list || !list.length) {
      return;
    }
    for (let i = 0; i < list.length; i++) {
      const handler = list[i];
      if (!handler) {
        list.splice(i, 1); // null的移除
        i--;
        continue;
      }
      const evt = GEvent.alloc(event, args);
      handler.runWith(evt);
      PoolMgr.release(evt);
      if (handler.once) {
        list[i] = null; // 置为null，下一回触发事件再移除
      }
    }
    if (list.length === 0) {
      delete this._messages[event];
    }
  }

  /**
   * 移除订阅信息列表
   * @param event 事件类型
   */
  public offListEvent(event: string): void {
    const list = this._messages[event];
    if (!list || !list.length) {
      return;
    }
    for (const handler of list) {
      if (handler) {
        handler.recover();
      }
    }
    delete this._messages[event];
  }

  public offListCaller(event: string, caller: any): void {
    const list = this._messages[event];
    if (!list || !list.length) {
      return;
    }
    for (let i = 0; i < list.length; i++) {
      const handler = list[i];
      if (handler && handler.caller === caller) {
        handler.recover();
        list[i] = null;
      }
    }
  }

  /**
   * 移除所有的订阅信息
   */
  public offAll(): void {
    for (const event in this._messages) {
      this.offListEvent(event);
    }
    this._messages = {};
  }
}
