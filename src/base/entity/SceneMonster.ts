import { SceneMonsterVo } from "@base/entity/SceneEntityVO";
import { CompType } from "@base/comps/CompsConst";
import { SceneEntity } from "@base/entity/SceneEntity";

/**
 * @date 2024/6/26
 */
export class SceneMonster extends SceneEntity {
  init(vo: SceneMonsterVo) {
    super.init(vo);
    this.addComp(CompType.AVATAR);
    this.addComp(CompType.MOVE);
    this.addComp(CompType.BATTLE);
  }
}
