/**
 * @date 2024/11/16
 */
import { ui } from "@ui/layaMaxUI";
import { emitter } from "@base/MessageMgr";
import { CommonEvent, IOpenCloseData } from "@def/misc";
import { ModuleType } from "@def/ModuleConst";
import { HitMoleViewType } from "@def/hit_mole";

export class HitMoleRuleMdr extends ui.modules.hit_mole.HitMoleRuleUI {
  // 皮肤中绑定
  public onHide(): void {
    emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
      module: ModuleType.HIT_MOLE,
      view: HitMoleViewType.RULE,
    });
  }
}
