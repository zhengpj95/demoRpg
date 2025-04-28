import { BaseEmitter } from "@base/mvc/BaseEmitter";

/**
 * @date 2024/4/10
 */
export abstract class BaseProxy extends BaseEmitter {
  // 子类重写
  public abstract init(): void;
}
