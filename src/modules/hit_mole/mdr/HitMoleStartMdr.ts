/**
 * @date 2024/11/16
 */
import { ui } from "@ui/layaMaxUI";
import { HitMoleViewType } from "@def/hit_mole";
import { ModuleType } from "@def/ModuleConst";
import { ComUtils } from "../../../ComUtils";
import Handler = Laya.Handler;

export class HitMoleStartMdr extends ui.modules.hit_mole.HitMoleStartUI {
  onOpened(param: any) {
    super.onOpened(param);
  }

  onEnable() {
    super.onEnable();
    this.btnStart.clickHandler = Handler.create(this, this.onBtnStar);

    this.labTest.overflow = "scroll";
    this.labTest.text = `打地鼠啦打地鼠啦，快来玩打地鼠啦，又菜又爱玩的地鼠来给大家助兴啦！走过路过，不要错过啦！`;
    this.scrollLab.text = `阿斯蒂芬打地鼠啦打地鼠啦，快来玩打地鼠啦，又菜又爱玩的地鼠来给大家助兴啦！走过路过，不要错过啦！`;

    // this.timerLoop(500, this, this.scrollLabel);
  }

  onAwake() {
    super.onAwake();
    this.scrollLab.text = `阿斯蒂芬打地鼠啦打地鼠啦，快来玩打地鼠啦，又菜又爱玩的地鼠来给大家助兴啦！走过路过，不要错过啦！`;
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

  public scrollLabel(): void {
    if (
      this.labTest1.scrollX >=
      this.labTest1.textWidth - this.labTest1.width
    ) {
      this.labTest1.scrollX = 0;
    } else {
      this.labTest1.scrollX = this.labTest1.scrollX + 20;
    }

    if (
      this.labTest.textField.scrollX >=
      this.labTest.textField.textWidth - this.labTest.width
    ) {
      this.labTest.textField.scrollX = 0;
    } else {
      this.labTest.textField.scrollX = this.labTest.textField.scrollX + 20;
    }
  }
}
