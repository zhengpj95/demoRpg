import { AvatarComponent } from "@base/component/AvatarComponent";
import { MoveComponent } from "@base/component/MoveComponent";
import { BattleComponent } from "@base/component/BattleComponent";
import { SkillComponent } from "@base/component/SkillComponent";

/**
 * @date 2024/6/18
 */
export const enum CompType {
  NONE = 0,
  AVATAR = 1,
  MAP = 2,
  MOVE = 3,
  CAMERA = 4,
  BATTLE = 5,
  SKILL = 6,
}

/**代码提示用*/
export interface ICompTypeMap {
  [CompType.AVATAR]: AvatarComponent;
  [CompType.MOVE]: MoveComponent;
  [CompType.BATTLE]: BattleComponent;
  [CompType.SKILL]: SkillComponent;
}

export const CompTypeMap: {
  [K in keyof ICompTypeMap]: new () => ICompTypeMap[K];
} = {
  [CompType.AVATAR]: AvatarComponent,
  [CompType.MOVE]: MoveComponent,
  [CompType.BATTLE]: BattleComponent,
  [CompType.SKILL]: SkillComponent,
};
