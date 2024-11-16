/**
 * @date 2024/11/16
 */
import { ui } from "@ui/layaMaxUI";
import { HitMoleViewType } from "@def/hit_mole";
import { ModuleType } from "@def/ModuleConst";
import { ComUtils } from "../../ComUtils";
import Handler = Laya.Handler;

export class HitMoleStartMdr extends ui.modules.hit_mole.HitMoleStartUI {
  onOpened(param: any) {
    super.onOpened(param);
  }

  onEnable() {
    super.onEnable();
    this.btnStart.clickHandler = Handler.create(this, this.onBtnStar);
  }

  // 通过 ClickScale 绑定，皮肤中设定
  public onClickRule(): void {
    ComUtils.openView(ModuleType.HIT_MOLE, HitMoleViewType.RULE);
  }

  // 通过button绑定
  private onBtnStar(): void {
    ComUtils.closeView(ModuleType.HIT_MOLE, HitMoleViewType.START);
    ComUtils.openView(ModuleType.HIT_MOLE, HitMoleViewType.MAIN);
  }
}
