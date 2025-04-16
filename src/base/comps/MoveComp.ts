import { BaseComp } from "@base/comps/BaseComp";
import { CompType } from "@base/comps/CompsConst";
import { AvatarComp } from "@base/comps/AvatarComp";
import { Action } from "@base/entity/EntityConst";
import { PathNode } from "@base/BaseConst";

export class MoveComp extends BaseComp {
  private _moveInterval = 1; //间隔，毫秒
  private _lastMoveTime = 0;
  private _pathList: PathNode[] = [];
  private _targetNode: PathNode;

  public addPath(node: PathNode): void {
    if (!node) return;
    this._pathList.push(node);
  }

  public start(): void {
    super.start();
    this._targetNode = <any>undefined;
    this._pathList.length = 0;
  }

  public stop(): void {
    super.stop();
  }

  public onAlloc(): void {
    super.onAlloc();
    this._lastMoveTime = 0;
    this._pathList.length = 0;
    this._targetNode = <any>undefined;
  }

  public tick(delta: number): void {
    if (!this._targetNode) {
      this._targetNode = this._pathList.shift();
    }
    if (!this._targetNode) {
      return;
    }

    const entity = this.entity;
    const vo = entity.vo;
    const avatar = <AvatarComp>entity.getComp(CompType.AVATAR);
    const dis = Laya.timer.currTimer - this._lastMoveTime;
    if (vo.point.x > this._targetNode.x) {
      if (dis > this._moveInterval) {
        vo.point.x -= 5;
        this._lastMoveTime = Laya.timer.currTimer;
      }
    } else {
      this._targetNode = <any>undefined;
      avatar.entity.vo.action = Action.ATTACK;
      this.stop();
    }
  }
}
