import { initModules } from "./modules/InitModules";
import { initFacade } from "@base/mvc/Facade";
import { MessageMgr } from "@base/MessageMgr";
import { DebugMgr } from "@base/DebugMgr";
import { LayerMgr } from "@base/LayerMgr";
import Event = Laya.Event;

/**
 * @date 2024/4/10
 */
export default class App {
  public static init(): void {
    initFacade();

    // 注册所有模块
    initModules();

    App.layerMgr.onResize();
    Laya.stage.on(Event.RESIZE, this.layerMgr, this.layerMgr.onResize);
  }

  //region getter
  /**==============================================================*/

  public static get messageMgr(): MessageMgr {
    return MessageMgr.ins();
  }

  public static get debugMgr(): DebugMgr {
    return DebugMgr.ins();
  }

  public static get layerMgr(): LayerMgr {
    return LayerMgr.ins();
  }

  /**==============================================================*/
  //endregion getter
}
