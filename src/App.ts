import { initModules } from "./modules/InitModules";
import { initFacade } from "@base/mvc/Facade";
import { LayerMgr } from "@base/LayerMgr";
import { initEmitter } from "@base/MessageMgr";
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

  /**==============================================================*/
  //endregion getter
}
