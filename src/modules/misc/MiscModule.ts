import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleType } from "@def/ModuleConst";
import { CommonEvent } from "@def/misc";
import { OpenViewCmd } from "./cmd/OpenViewCmd";
import { CloseViewCmd } from "./cmd/CloseViewCmd";

/**
 * @date 2024/4/17
 */
export class MiscModule extends BaseModule {
  public constructor() {
    super(ModuleType.MISC);
  }

  initCmd() {
    super.initCmd();
    this.regCmd(CommonEvent.OPEN_VIEW, OpenViewCmd);
    this.regCmd(CommonEvent.CLOSE_VIEW, CloseViewCmd);
  }
}
