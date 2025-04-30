/**
 * @date 2024/11/16
 */
import { emitter } from "@base/MessageMgr";
import { CommonEvent, IOpenCloseData } from "@def/misc";
import { ModuleName } from "@def/ModuleConst";
import { HitMoleViewType } from "@def/hit_mole";
import { BaseMediator } from "@base/mvc/BaseMediator";
import { ui } from "@ui/layaMaxUI";
import { LayerIndex } from "@base/LayerMgr";
import HitMoleRuleUI = ui.modules.hit_mole.HitMoleRuleUI;

export class HitMoleRuleMdr extends BaseMediator<HitMoleRuleUI> {
  // 皮肤中绑定
  public onHide(): void {
    emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
      module: ModuleName.HIT_MOLE,
      view: HitMoleViewType.RULE,
    });
  }

  constructor() {
    super("modules/hit_mole/HitMoleRule.scene", LayerIndex.MODAL);
  }

  protected addEvents(): void {}

  protected initUI(): void {}

  protected onClose(): void {}

  protected onOpen(): void {}

  protected removeEvents(): void {}
}
