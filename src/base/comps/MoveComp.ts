import { BaseComp } from "@base/comps/BaseComp";
import { CompType } from "@base/comps/CompsConst";
import { AvatarComp } from "@base/comps/AvatarComp";
import { Action } from "@base/entity/EntityConst";

export class MoveComp extends BaseComp {
  private _targetPoint: { x: number; y: number };
  private _moveInterval = 1; //间隔，毫秒
  private _lastMoveTime = 0;

  start() {
    super.start();
    this._targetPoint = { x: 0, y: 568 };
  }

  stop() {
    super.stop();
  }

  tick(delta: number) {
    super.tick(delta);
    const entity = this.entity;
    const vo = entity.vo;
    const avatar = <AvatarComp>entity.getComp(CompType.AVATAR);
    const dis = Laya.timer.currTimer - this._lastMoveTime;
    if (avatar.display.x > this._targetPoint.x + 100) {
      if (dis > this._moveInterval) {
        avatar.display.x -= 1;
        this._lastMoveTime = Laya.timer.currTimer;
      }
    } else {
      avatar.entity.vo.action = Action.STAND;
    }
  }
}
