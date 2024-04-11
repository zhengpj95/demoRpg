import SingletonClass from "./core/SingletonClass";
import Handler = Laya.Handler;

type func = () => void;

/**
 * 信息管理器
 * subscribe-publish pattern 订阅发布模式
 * @date 2024/4/11
 */
export class MessageMgr extends SingletonClass {
  private _messages: { [key: string]: Handler[] } = {};

  public static ins: () => MessageMgr;

  private createListener(
    caller: any,
    method: func,
    args?: any[],
    once?: boolean,
  ): Handler {
    return Handler.create(caller, method, args, once);
  }

  /**
   * 订阅信息
   * @param key 唯一key
   * @param method 回调函数
   * @param caller 回调函数对象
   * @param args 携带的参数
   * @param once 只执行一次
   */
  public on(
    key: string,
    method: func,
    caller: any,
    args?: any[],
    once?: boolean,
  ): void {
    if (!this._messages[key]) {
      this._messages[key] = [];
    }
    const funcList: Handler[] = this._messages[key];
    for (const item of funcList) {
      if (item && item.method === method && item.caller === caller) {
        return;
      }
    }
    this._messages[key].push(this.createListener(caller, method, args, once));
  }

  /**
   * 移除订阅信息
   * @param key 唯一key
   * @param method 移除的回调函数
   * @param caller 移除的回调函数对象
   */
  public off(key: string, method: func, caller: any): void {
    const funcList = this._messages[key];
    if (!funcList || !funcList.length) {
      return;
    }
    for (let i = 0; i < funcList.length; i++) {
      const item = funcList[i];
      if (item && item.method === method && item.caller === caller) {
        funcList[i].recover();
        funcList[i] = null;
        break;
      }
    }
  }

  /**
   * 发布信息
   * @param key 唯一key
   * @param args 参数
   */
  public emit(key: string, args?: any): void {
    const funcList = this._messages[key];
    if (!funcList || !funcList.length) {
      return;
    }
    if (args != null) {
      args = [].concat(args);
    }
    for (let i = 0; i < funcList.length; i++) {
      const item = funcList[i];
      if (!item) {
        funcList.splice(i, 1); // null的移除
        i--;
        continue;
      }
      item.runWith(args);
      if (item.once) {
        funcList[i] = null; // 置为null，下一回触发事件再移除
      }
    }
  }

  /**
   * 移除订阅信息列表
   * @param key 唯一key
   */
  public offList(key: string): void {
    const funcList = this._messages[key];
    if (!funcList || !funcList.length) {
      return;
    }
    for (const fun of funcList) {
      if (fun) {
        fun.recover();
      }
    }
    delete this._messages[key];
  }

  /**
   * 移除所有的订阅信息
   */
  public offAll(): void {
    const keys = Object.keys(this._messages) || [];
    for (const key of keys) {
      this.offList(key);
      delete this._messages[key];
    }
    this._messages = {};
  }
}
