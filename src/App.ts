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
class App {
  public init(): void {
    initEmitter();
    initFacade();

    // 注册所有模块
    initModules();

    this.layerMgr.onResize();
    Laya.stage.on(Event.RESIZE, this.layerMgr, this.layerMgr.onResize);
  }

  //region getter
  /**==============================================================*/

  public get layerMgr(): LayerMgr {
    return LayerMgr.ins();
  }

  public get updateMgr(): UpdateMgr {
    return UpdateMgr.ins();
  }

  public get debugMgr(): DebugMgr {
    return DebugMgr.ins();
  }

  /**==============================================================*/
  //endregion getter
}

export let app: App;

export function setApp(): void {
  app = new App();
  app.init();

  if (window) {
    window["app"] = app;
  }
}
