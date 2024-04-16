import { initModules } from "./modules/InitModules";
import { facade, initFacade } from "@base/mvc/Facade";
import { MessageMgr } from "@base/MessageMgr";
import { DebugMgr } from "@base/DebugMgr";
import { CommonEvent, IOpenCloseData } from "@def/Common";

/**
 * @date 2024/4/10
 */
export default class App {
  public static init(): void {
    initFacade();

    // 注册所有模块
    initModules();

    App.messageMgr.on(CommonEvent.OPEN_VIEW, this.showView, this);
    App.messageMgr.on(CommonEvent.CLOSE_VIEW, this.closeView, this);
  }

  /**
   * 打开界面
   * @param data
   */
  public static showView(data: IOpenCloseData): void {
    const module = facade.retModule(data.module);
    if (!module) {
      console.error(`App.showView error, module:${data.module}`);
      return;
    }
    const mdrCls = module.retMdr(data.view);
    if (!mdrCls) {
      console.error(
        `App.showView error, module:${data.module}, viewType:${data.view}`,
      );
      return;
    }
    Laya.stage.addChild(new mdrCls());
  }

  /**
   * 关闭界面
   * @param data
   */
  public static closeView(data: IOpenCloseData): void {
    const module = facade.retModule(data.module);
    if (!module) {
      console.error(`App.showView error, module:${data.module}`);
      return;
    }
    const mdrCls = module.retMdr(data.view);
    if (!mdrCls) {
      console.error(
        `App.showView error, module:${data.module}, viewType:${data.view}`,
      );
      return;
    }
    //
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
