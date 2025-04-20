import { SceneMonsterVo } from "@base/entity/SceneEntityVO";
import { CompType } from "@base/component/CompsConst";
import { SceneEntity } from "@base/entity/SceneEntity";
import { PathNode } from "@base/BaseConst";

/**
 * @date 2024/6/26
 */
export class SceneMonster extends SceneEntity {
  public init(vo: SceneMonsterVo): void {
    super.init(vo);
    this.addComponent(CompType.AVATAR);
    this.addComponent(CompType.MOVE);
    this.addComponent(CompType.BATTLE);
  }

  /**添加路径*/
  public addPath(node: PathNode): void {
    const comp = this.getComponent(CompType.MOVE);
    if (comp) {
      comp.addPath(node);
    }
  }

  public update(elapsed: number): void {
    super.update(elapsed);
  }
}
