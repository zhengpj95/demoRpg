import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleType, ProxyType } from "@def/ModuleConst";
import { SceneViewType } from "@def/scene";
import { SceneMdr } from "./mdr/SceneMdr";
import { LayerIndex } from "@base/LayerMgr";
import { SceneProxy } from "./model/SceneProxy";

/**
 * @date 2024/6/16
 */
export class SceneModule extends BaseModule {
  constructor() {
    super(ModuleType.SCENE);
  }

  public initProxy(): void {
    super.initProxy();
    this.regProxy(ProxyType.SCENE, SceneProxy);
  }

  public initMdr(): void {
    super.initMdr();
    this.regMdr(SceneViewType.SCENE, SceneMdr, LayerIndex.MAP);
  }
}
