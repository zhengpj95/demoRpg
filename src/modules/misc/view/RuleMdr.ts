import { BaseMediator } from "@base/mvc/BaseMediator";
import { LayerIndex } from "@base/LayerMgr";
import { ui } from "@ui/layaMaxUI";
import RuleUI = ui.modules.misc.RuleUI;

/**
 * @date 2025/4/26
 */
export class RuleMdr extends BaseMediator<RuleUI> {
  constructor() {
    super("modules/misc/Rule.scene", LayerIndex.MODAL);
  }

  protected initUI(): void {}

  protected addEvents(): void {}

  protected removeEvents(): void {}

  protected onOpen(): void {
    console.log("rule: ", this.params, this.ui.labDesc);
  }

  protected onClose(): void {}
}
