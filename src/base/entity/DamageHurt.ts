import Sprite = Laya.Sprite;
import Label = Laya.Label;
import { IPoolObject } from "@base/BaseConst";
import PoolMgr from "@base/core/PoolMgr";

/**
 * @author zpj
 * @date 2025/5/14
 */
export class DamageHurt extends Sprite implements IPoolObject {
  private _lab: Label;

  public onAlloc(): void {
    this.init();
  }

  private init(): void {
    this.width = this.height = 10;
    if (!this._lab) {
      this._lab = new Label();
      this._lab.text = "";
      this._lab.fontSize = 20;
      this._lab.bold = true;
      this._lab.color = "#ff0000";
      this._lab.centerY = this._lab.centerX = 0;
      this.addChild(this._lab);
    }
  }

  public onRelease(): void {
    if (this._lab) {
      this._lab.text = "";
    }
  }

  public release(): void {
    PoolMgr.release(this);
  }

  public set damage(num: number) {
    if (this._lab) {
      this._lab.text = num + "";
    }
  }
}
