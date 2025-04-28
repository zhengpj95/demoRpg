import { AvatarComponent } from "@base/component/AvatarComponent";
import { MoveComponent } from "@base/component/MoveComponent";
import { BattleComponent } from "@base/component/BattleComponent";
import { SkillComponent } from "@base/component/SkillComponent";

/**
 * @date 2024/6/18
 */
export const enum ComponentType {
  NONE = 0,
  AVATAR = 1,
  MAP = 2,
  MOVE = 3,
  CAMERA = 4,
  BATTLE = 5,
  SKILL = 6,
}

/**代码提示用*/
export interface IComponentTypeMap {
  [ComponentType.AVATAR]: AvatarComponent;
  [ComponentType.MOVE]: MoveComponent;
  [ComponentType.BATTLE]: BattleComponent;
  [ComponentType.SKILL]: SkillComponent;
}

export const ComponentTypeMap: {
  [K in keyof IComponentTypeMap]: new () => IComponentTypeMap[K];
} = {
  [ComponentType.AVATAR]: AvatarComponent,
  [ComponentType.MOVE]: MoveComponent,
  [ComponentType.BATTLE]: BattleComponent,
  [ComponentType.SKILL]: SkillComponent,
};
