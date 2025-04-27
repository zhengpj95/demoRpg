/**
 * @date 2024/11/16
 */
import { ui } from "@ui/layaMaxUI";
import { HitMoleViewType } from "@def/hit_mole";
import { ModuleType } from "@def/ModuleConst";
import { BaseMediator } from "@base/mvc/BaseMediator";
import { LayerIndex } from "@base/LayerMgr";
import { closeView, openView } from "@base/BaseConst";
import Handler = Laya.Handler;
import HitMoleStartUI = ui.modules.hit_mole.HitMoleStartUI;

export class HitMoleStartMdr extends BaseMediator<HitMoleStartUI> {
  constructor() {
    super("modules/hit_mole/HitMoleStart.scene", LayerIndex.WIN);
  }

  protected addEvents(): void {}

  protected initUI(): void {}

  protected onClose(): void {}

  protected onOpen(): void {
    this.onEnable();
  }

  protected removeEvents(): void {}

  onEnable() {
    this.ui.btnStart.clickHandler = Handler.create(this, this.onBtnStar);
    this.ui.scrollLab.text = `地鼠出现的瞬间将其打晕，即可得到对应的奖励！注意哦，不要打到精灵鼠`;
  }

  // 通过 ClickScale 绑定，皮肤中设定
  public onClickRule(): void {
    openView(ModuleType.HIT_MOLE, HitMoleViewType.RULE);
  }

  // 通过button绑定
  private onBtnStar(): void {
    closeView(ModuleType.HIT_MOLE, HitMoleViewType.START);
    openView(ModuleType.HIT_MOLE, HitMoleViewType.MAIN);
  }
}
