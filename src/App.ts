import { ModuleType } from "./base/ModuleConst";
import { MessageMgr } from "./base/MessageMgr";
import { DebugMgr } from "./base/DebugMgr";
import { facade, initFacade } from "./base/index";

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

  //region getter
  /**==============================================================*/

  public static get messageMgr(): MessageMgr {
    return MessageMgr.ins();
  }

  public static get debugMgr(): DebugMgr {
    return DebugMgr.ins();
  }

  /**==============================================================*/
  //endregion getter
}
