import { AvatarComp } from "@base/comps/AvatarComp";
import { MoveComp } from "@base/comps/MoveComp";

/**
 * @date 2024/6/18
 */
export const enum CompType {
  NONE = 0,
  AVATAR = 1,
  MAP = 2,
  MOVE = 3,
  CAMERA = 4,
}

/**代码提示用*/
export interface ICompTypeMap {
  [CompType.AVATAR]: AvatarComp;
  [CompType.MOVE]: MoveComp;
}

export const CompTypeMap: {
  [K in keyof ICompTypeMap]: new () => ICompTypeMap[K];
} = {
  [CompType.AVATAR]: AvatarComp,
  [CompType.MOVE]: MoveComp,
};
