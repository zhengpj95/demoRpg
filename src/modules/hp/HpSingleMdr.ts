import { ui } from "../../ui/layaMaxUI";
import { MathUtils } from "../../base/utils/MathUtils";
import { IBaseMdr, LayerIndex } from "../../base/LayerMgr";
import Handler = Laya.Handler;
import Pool = Laya.Pool;

export default class HpSingleMdr extends ui.hp.HpSingleUI implements IBaseMdr {
  public _layerIndex_: LayerIndex = LayerIndex.WIN;
  private _maxHp = 0;
  private _maxHp1 = 0;

  constructor() {
    super();
  }

  onAwake() {
    super.onAwake();
    console.log(`HpSingle onAwake`);
  }

  onEnable() {
    super.onEnable();
    console.log(`HpSingle onEnable`);
    this._maxHp = this._maxHp1 = 100000;
    this.timer.loop(500, this, this.onUpdateHp);
  }

  private onUpdateHp(): void {
    const subHp = MathUtils.getRandom(0, 5000);
    this.tweenHp(subHp);
    this._maxHp1 = this._maxHp1 - subHp;

    console.log(`11111 ${this._maxHp1}, ${this._maxHp1 / this._maxHp}`);
    const w = 500 * (this._maxHp1 / this._maxHp);
    Laya.Tween.to(
      this.imgHp,
      { width: w },
      500,
      null,
      Handler.create(this, () => {
        if (w <= 0) {
          this.timer.clearAll(this);
        }
      }),
    );
  }

  /**
   * Pool.createByClass(Laya.Label) 和 Pool.recoverByClass(lab)
   * Pool.getItemByClass("HpLabel", Laya.Label) 和 Pool.recover("HpLabel", lab)
   */
  private tweenHp(hp: number): void {
    const lab = Pool.getItemByClass("HpLabel", Laya.Label);
    lab.text = "-" + hp;
    lab.fontSize = 24;
    lab.color = "#ff0000";
    lab.centerX = 0;
    lab.y = 200;
    lab.alpha = 1;
    this.boxVal.addChild(lab);
    Laya.Tween.to(
      lab,
      { y: 20, alpha: 0 },
      1000,
      null,
      Handler.create(this, () => {
        lab.removeSelf();
        Pool.recover("HpLabel", lab);
      }),
    );
  }
}
