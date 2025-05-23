/**
 * 测试模块
 * @date 2024/4/26
 */
import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleName, ProxyType } from "@def/ModuleConst";
import { TestProxy } from "./model/TestProxy";

export class TestModule extends BaseModule {
  constructor() {
    super(ModuleName.TEST);
  }

  protected initCmd(): void {}

  protected initProxy(): void {
    this.regProxy(ProxyType.TEST, TestProxy);
  }

  protected initMdr(): void {}
}
