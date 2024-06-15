import { SceneMap } from "@base/map/SceneMap";
import { LayerIndex, LayerMgr } from "@base/LayerMgr";

/**
 * 场景
 * @date 2024/6/16
 */
export class SceneMdr extends Laya.Scene {
  private _map: SceneMap;

  constructor() {
    super();
  }

  open(closeOther?: boolean, param?: any) {
    super.open(closeOther, param);
    this._map = new SceneMap();
    LayerMgr.ins().getLayer(LayerIndex.MAP).addChild(this._map);
  }
}
