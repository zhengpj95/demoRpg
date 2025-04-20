import { initModules } from "./modules/InitModules";
import { initFacade } from "@base/mvc/Facade";
import { LayerMgr } from "@base/LayerMgr";
import { emitter, initEmitter } from "@base/MessageMgr";
import { DebugMgr } from "@base/DebugMgr";
import { UpdateMgr } from "@base/UpdateMgr";
import { ModuleType } from "@def/ModuleConst";
import { CommonEvent, IOpenCloseData } from "@def/misc";
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

  public openView(m: ModuleType, v: number | string, param?: any): void {
    emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
      module: m,
      view: v,
      param: param,
    });
  }

  public closeView(m: ModuleType, v: number | string): void {
    emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
      module: m,
      view: v,
    });
  }
}

export let app: App;

export function setApp(): void {
  app = new App();
  app.init();

  if (window) {
    window["app"] = app;
  }
}
