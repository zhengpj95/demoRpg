import { BaseProxy } from "./mvc/BaseProxy";
import SingletonClass from "./core/SingletonClass";

/**
 * @date 2024/4/11
 */
export class DebugMgr extends SingletonClass {
  public static ins: () => DebugMgr;

  public debug(name: string, cls: any): void {
    if (name && cls) {
      window[name] = cls;
    }
  }

  public debugProxy(proxy: BaseProxy): void {
    if (proxy.constructor.name) {
      window[proxy.constructor.name] = proxy;
    }
  }
}
