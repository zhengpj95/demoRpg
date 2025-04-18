/**
 * @date 2024/11/16
 */
import { ui } from "@ui/layaMaxUI";
import { HitMoleViewType } from "@def/hit_mole";
import { ModuleType } from "@def/ModuleConst";
import { emitter } from "@base/MessageMgr";
import { CommonEvent, IOpenCloseData } from "@def/misc";
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
    emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
      module: ModuleType.HIT_MOLE,
      view: HitMoleViewType.RULE,
    });
  }

  // 通过button绑定
  private onBtnStar(): void {
    emitter.emit(CommonEvent.CLOSE_VIEW, <IOpenCloseData>{
      module: ModuleType.HIT_MOLE,
      view: HitMoleViewType.START,
    });
    emitter.emit(CommonEvent.OPEN_VIEW, <IOpenCloseData>{
      module: ModuleType.HIT_MOLE,
      view: HitMoleViewType.MAIN,
    });
  }
}
