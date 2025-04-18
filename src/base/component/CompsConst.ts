import { AvatarComponent } from "@base/component/AvatarComponent";
import { MoveComponent } from "@base/component/MoveComponent";
import { BattleComponent } from "@base/component/BattleComponent";

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
}

/**代码提示用*/
export interface ICompTypeMap {
  [CompType.AVATAR]: AvatarComponent;
  [CompType.MOVE]: MoveComponent;
  [CompType.BATTLE]: BattleComponent;
}

export const CompTypeMap: {
  [K in keyof ICompTypeMap]: new () => ICompTypeMap[K];
} = {
  [CompType.AVATAR]: AvatarComponent,
  [CompType.MOVE]: MoveComponent,
  [CompType.BATTLE]: BattleComponent,
};
