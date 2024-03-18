import { ui } from "../ui/layaMaxUI";
import { MathUtils } from "../utils/MathUtils";
import Handler = Laya.Handler;
import Pool = Laya.Pool;

export default class HpSingle extends ui.hp.HpSingleUI {
  private _maxHp = 0;
  private _maxHp1 = 0;

  constructor() {
    super();
  }

  onEnable() {
    super.onEnable();
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

  private tweenHp(hp: number): void {
    const lab = Pool.createByClass(Laya.Label);
    lab.text = hp + "";
    lab.fontSize = 24;
    lab.color = "#00ff00";
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
        Pool.recoverByClass(lab);
      }),
    );
  }
}
