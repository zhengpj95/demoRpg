import { SceneMap } from "./SceneMap";

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
    this._map.init(1001);
    this.addChild(this._map);
  }
}
