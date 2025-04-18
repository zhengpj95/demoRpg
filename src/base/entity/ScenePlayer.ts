import { ScenePlayerVO } from "@base/entity/SceneEntityVO";
import { CompType } from "@base/component/CompsConst";
import { SceneEntity } from "@base/entity/SceneEntity";

/**
 * @date 2024/6/26
 */
export class ScenePlayer extends SceneEntity {
  public init(vo: ScenePlayerVO): void {
    super.init(vo);
    this.addComp(CompType.AVATAR);
    this.addComp(CompType.BATTLE);
  }

  public update(elapsed: number): void {
    super.update(elapsed);
  }
}
