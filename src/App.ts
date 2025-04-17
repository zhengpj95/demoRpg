import { initModules } from "./modules/InitModules";
import { initFacade } from "@base/mvc/Facade";
import { LayerMgr } from "@base/LayerMgr";
import { initEmitter } from "@base/MessageMgr";
import { DebugMgr } from "@base/DebugMgr";
import { UpdateMgr } from "@base/UpdateMgr";
import Event = Laya.Event;

/**
 * @date 2024/4/10
 */
export default class App {
  public static init(): void {
    initEmitter();
    initFacade();

    // 注册所有模块
    initModules();

    App.layerMgr.onResize();
    Laya.stage.on(Event.RESIZE, this.layerMgr, this.layerMgr.onResize);
  }

  //region getter
  /**==============================================================*/

  public static get layerMgr(): LayerMgr {
    return LayerMgr.ins();
  }

  public static get updateMgr(): UpdateMgr {
    return UpdateMgr.ins();
  }

  public static get debugMgr(): DebugMgr {
    return DebugMgr.ins();
  }

  /**==============================================================*/
  //endregion getter
}
DebugMgr.ins().debug("App", App);
