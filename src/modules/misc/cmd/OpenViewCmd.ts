import { BaseCommand } from "@base/mvc/BaseCommand";
import { IOpenCloseData } from "@def/misc";
import { facade } from "@base/mvc/Facade";
import { GEvent } from "@base/core/GEvent";

export const mdrInsObj = {};

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
    const mdrCls = module.retMdr2(data.view);
    if (!mdrCls) {
      console.error(
        `App.showView error, module:${data.module}, viewType:${data.view}`,
      );
      return;
    }
    const mdrIns = new mdrCls();
    mdrIns.setName(`${mdrCls.name} m:${data.module},v:${data.view}`);
    mdrIns.open(data.param);
    mdrInsObj[`_${data.module}_${data.view}_`] = mdrIns;
    console.log(`OpenViewCmd 打开界面 m:${data.module},v:${data.view}`);
  }
}
