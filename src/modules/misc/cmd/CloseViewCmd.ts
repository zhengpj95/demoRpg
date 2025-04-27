import { BaseCommand } from "@base/mvc/BaseCommand";
import { IOpenCloseData } from "@def/misc";
import { facade } from "@base/mvc/Facade";
import { mdrInsObj } from "./OpenViewCmd";
import { GEvent } from "@base/core/GEvent";
import { BaseMediator } from "@base/mvc/BaseMediator";

/**
 * @date 2024/4/17
 */
export class CloseViewCmd extends BaseCommand {
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
    const mdrKey = `_${data.module}_${data.view}_`;
    if (mdrInsObj[mdrKey]) {
      (mdrInsObj[mdrKey] as BaseMediator).close();
      mdrInsObj[mdrKey] = undefined;
      delete mdrInsObj[mdrKey];
    }
  }
}
