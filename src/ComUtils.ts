/**
 * @date 2024/11/16
 */
import { ModuleType } from "@def/ModuleConst";
import { emitter } from "@base/MessageMgr";
import { CommonEvent, IOpenCloseData } from "@def/misc";

export class ComUtils {
  public static openView(m: ModuleType, v: number | string, param?: any): void {
    emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
      module: m,
      view: v,
      param: param,
    });
  }

  public static closeView(m: ModuleType, v: number | string): void {
    emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
      module: m,
      view: v,
    });
  }
}
