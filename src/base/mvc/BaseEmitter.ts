import { emitter } from "@base/MessageMgr";

type VoidFunc = (...args: any) => void;

/**
 * @author zpj
 * @date 2025/4/28
 */
export class BaseEmitter {
  public emit(event: string, args?: any): void {
    emitter.emit(event, args);
  }

  public on(event: string, method: VoidFunc, caller: any, args?: any): void {
    emitter.on(event, method, caller, args);
  }

  public off(event: string, method: (...args: any) => void, caller: any): void {
    emitter.off(event, method, caller);
  }

  public offAll(event: string, caller: any): void {
    emitter.offListCaller(event, caller);
  }
}
