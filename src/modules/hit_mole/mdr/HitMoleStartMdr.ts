/**
 * @date 2024/11/16
 */
import { ui } from "@ui/layaMaxUI";
import { HitMoleViewType } from "@def/hit_mole";
import { ModuleType } from "@def/ModuleConst";
import App from "../../../App";
import Handler = Laya.Handler;

export class HitMoleStartMdr extends ui.modules.hit_mole.HitMoleStartUI {
  onOpened(param: any) {
    super.onOpened(param);
  }

  onEnable() {
    super.onEnable();
    this.btnStart.clickHandler = Handler.create(this, this.onBtnStar);
    this.scrollLab.text = `地鼠出现的瞬间将其打晕，即可得到对应的奖励！注意哦，不要打到精灵鼠`;
  }

  // 通过 ClickScale 绑定，皮肤中设定
  public onClickRule(): void {
    App.openView(ModuleType.HIT_MOLE, HitMoleViewType.RULE);
  }

  // 通过button绑定
  private onBtnStar(): void {
    App.closeView(ModuleType.HIT_MOLE, HitMoleViewType.START);
    App.openView(ModuleType.HIT_MOLE, HitMoleViewType.MAIN);
  }
}
