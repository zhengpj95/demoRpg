import { emitter } from "@base/MessageMgr";

/**
 * @date 2024/4/10
 */
export abstract class BaseProxy {
  // 子类重写
  public abstract init(): void;

  public emit(event: string, args?: any): void {
    emitter.emit(event, args);
  }

  public on(
    event: string,
    method: (...args: any) => void,
    caller: any,
    args?: any,
  ): void {
    emitter.on(event, method, caller, args);
  }
}
