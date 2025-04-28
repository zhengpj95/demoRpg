import { SceneMonsterVo } from "@base/entity/SceneEntityVO";
import { ComponentType } from "@base/component/ComponentConst";
import { SceneEntity } from "@base/entity/SceneEntity";
import { PathNode } from "@base/BaseConst";

/**
 * @date 2024/6/26
 */
export class SceneMonster extends SceneEntity {
  public init(vo: SceneMonsterVo): void {
    super.init(vo);
    this.addComponent(ComponentType.AVATAR);
    this.addComponent(ComponentType.MOVE);
    this.addComponent(ComponentType.BATTLE);
  }

  /**添加路径*/
  public addPath(node: PathNode): void {
    const comp = this.getComponent(ComponentType.MOVE);
    if (comp) {
      comp.addPath(node);
    }
  }

  public update(elapsed: number): void {
    super.update(elapsed);
  }
}
