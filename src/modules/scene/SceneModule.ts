import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleType } from "@def/ModuleConst";
import { SceneViewType } from "@def/scene";
import { SceneMdr } from "./mdr/SceneMdr";
import { LayerIndex } from "@base/LayerMgr";

/**
 * @date 2024/6/16
 */
export class SceneModule extends BaseModule {
  constructor() {
    super(ModuleType.SCENE);
  }

  initMdr() {
    super.initMdr();
    this.regMdr(SceneViewType.SCENE, SceneMdr, LayerIndex.MAP);
  }
}
