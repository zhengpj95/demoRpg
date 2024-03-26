import { LayerIndex } from "./LayerMgr";
import View = Laya.View;
import Scene = Laya.Scene;

/**
 * 界面逻辑类，处理皮肤以及具体逻辑
 * todo（需要处理一套打开关闭规则，onShow, onHide等）
 *
 * 使用方式：
 * export class HpSingleMdr extends BaseMdr {
 *   constructor() {
 *     super(LayerIndex.WIN);
 *     this.v = new HpSingleUI();
 *   }
 * }
 */
export class BaseMdr {
  private _layerIndex: number;

  get layerIndex(): number {
    return this._layerIndex;
  }

  set layerIndex(value: number) {
    this._layerIndex = value;
  }

  private _v: Scene | View;

  get v(): Laya.Scene | Laya.View {
    return this._v;
  }

  set v(value: Laya.Scene | Laya.View) {
    this._v = value;
  }

  public constructor(idx: LayerIndex) {
    this.layerIndex = idx;
  }
}
