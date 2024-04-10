import { facade, initFacade } from "./base/mvc/Facade";
import { ModuleType } from "./base/ModuleConst";

/**
 * @date 2024/4/10
 */
export default class App {
  public static init(): void {
    initFacade();

    this.initModule();
    facade.instantiate();
  }

  // 注册所有模块
  private static initModule(): void {
    //
  }

  // 打开界面
  public static showView(moduleType: ModuleType, viewType: number): void {
    const module = facade.retModule(moduleType);
    if (!module) {
      console.error(`App.showView error, module:${moduleType}`);
      return;
    }
    const mdrCls = module.retMdr(viewType);
    if (!mdrCls) {
      console.error(
        `App.showView error, module:${moduleType}, viewType:${viewType}`,
      );
      return;
    }
    Laya.stage.addChild(new mdrCls());
  }
}
