import { emitter } from "@base/MessageMgr";

/**
 * @date 2024.4.13
 */
export abstract class BaseCommand {
  public abstract exec(args: any): void;

  public emit(event: string, args?: any): void {
    emitter.emit(event, args);
  }
}
