import { BaseCommand } from "@base/mvc/BaseCommand";
import { IOpenCloseData } from "@def/misc";
import { facade } from "@base/mvc/Facade";
import { GEvent } from "@base/core/GEvent";

/**
 * @date 2024/4/17
 */
export class CloseViewCmd extends BaseCommand {
  public exec(e: GEvent<IOpenCloseData>): void {
    const data = e.data;
    const module = facade.retModule(data.module);
    if (!module) {
      console.error(`App.showView error, module:${data.module}`);
      return;
    }
    module.removeMdrIns(data.view);
  }
}
