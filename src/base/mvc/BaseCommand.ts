import { BaseEmitter } from "@base/mvc/BaseEmitter";

/**
 * @date 2024.4.13
 */
export abstract class BaseCommand extends BaseEmitter {
  public abstract exec(args: any): void;
}
