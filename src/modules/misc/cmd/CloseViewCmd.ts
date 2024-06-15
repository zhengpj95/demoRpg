import { BaseCommand } from "@base/mvc/BaseCommand";
import { IOpenCloseData } from "@def/misc";
import { facade } from "@base/mvc/Facade";
import { LayerMgr } from "@base/LayerMgr";
import { createMdrKey } from "./OpenViewCmd";

/**
 * @date 2024/4/17
 */
export class CloseViewCmd extends BaseCommand {
  exec(data: IOpenCloseData): void {
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
    const layerIdx = module.retMdrIdx(data.view);
    const layer = LayerMgr.ins().getLayer(layerIdx);
    layer.doRemoveMdr(createMdrKey(data));
  }
}
