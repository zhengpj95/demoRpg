import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleType, ProxyType } from "@def/ModuleConst";
import { SceneViewType } from "@def/scene";
import { SceneMdr } from "./mdr/SceneMdr";
import { SceneProxy } from "./model/SceneProxy";

/**
 * @date 2024/6/16
 */
export class SceneModule extends BaseModule {
  constructor() {
    super(ModuleType.SCENE);
  }

  protected initCmd(): void {}

  public initProxy(): void {
    this.regProxy(ProxyType.SCENE, SceneProxy);
  }

  public initMdr(): void {
    this.regMdr(SceneViewType.SCENE, SceneMdr);
  }
}
