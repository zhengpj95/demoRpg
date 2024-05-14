/**
 * 测试模块
 * @date 2024/4/26
 */
import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleType, ProxyType } from "@def/ModuleConst";
import { TestViewType } from "@def/test";
import { HpSingleMdr } from "./mdr/HpSingleMdr";
import { MainHpMdr } from "./mdr/MainHpMdr";
import { TestPanelMdr } from "./mdr/TestPanelMdr";
import { TestPanelCloudMdr } from "./mdr/TestPanelCloudMdr";
import { TestProxy } from "./model/TestProxy";

export class TestModule extends BaseModule {
  constructor() {
    super(ModuleType.TEST);
  }

  initProxy(): void {
    super.initProxy();
    this.regProxy(ProxyType.TEST, TestProxy);
  }

  initCmd(): void {
    super.initCmd();
  }

  initMdr(): void {
    super.initMdr();
    this.regMdr(TestViewType.HP_SINGLE, HpSingleMdr);
    this.regMdr(TestViewType.HP_MAIN, MainHpMdr);
    this.regMdr(TestViewType.TEST_PANEL, TestPanelMdr);
    this.regMdr(TestViewType.TEST_PANEL_CLOUD, TestPanelCloudMdr);
  }
}
