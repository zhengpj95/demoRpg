import { BaseCommand } from "@base/mvc/BaseCommand";
import { IOpenCloseData } from "@def/misc";
import { facade } from "@base/mvc/Facade";
import { LayerMgr } from "@base/LayerMgr";
import { GEvent } from "@base/core/GEvent";

/**创建mdr唯一标识*/
export function createMdrKey(data: IOpenCloseData): string {
  return `mv_${data.module}_${data.view}`;
}

/**
 * @date 2024/4/17
 */
export class OpenViewCmd extends BaseCommand {
  exec(e: GEvent<IOpenCloseData>): void {
    const data = e.data;
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
    const mdrKey = createMdrKey(data);
    layer.doAddMdr(mdrCls, mdrKey);
    console.log(`OpenViewCmd 打开界面 m:${data.module},v:${data.view}`);
  }
}
