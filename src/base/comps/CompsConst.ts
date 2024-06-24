import { AvatarComp } from "@base/comps/AvatarComp";
import { BaseComp } from "@base/comps/BaseComp";
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

export const CompTypeMap: Record<number, new () => BaseComp> = {
  [CompType.AVATAR]: AvatarComp,
  [CompType.MOVE]: MoveComp,
};
