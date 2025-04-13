import { BaseComp } from "./BaseComp";
import { CompType } from "./CompsConst";
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import { Action } from "@base/entity/EntityConst";
import { RpgMovieClip } from "@base/movieclip/RpgMovieClip";
import { CallBack } from "@base/CallBack";
import Sprite = Laya.Sprite;

/**
 * 场景模型
 */
export class AvatarComp extends BaseComp {
  private _display: Sprite;
  private _curAction: Action;
  private _isLoadAtlas = false;
  private _rpg: RpgMovieClip;

  get display(): Sprite {
    return this._display;
  }

  set display(value: Laya.Sprite) {
    this._display = value;
  }

  constructor() {
    super();
    this.type = CompType.AVATAR;
  }

  start() {
    super.start();
    if (!this.display) {
      this.display = new Sprite();
      this.display.name = "avatarComp";
      const point = this.entity.vo.point;
      this.display.x = point ? point.x : 0;
      this.display.y = point ? point.y : 0;
    }
    if (!this._rpg) {
      this._rpg = new RpgMovieClip();
      this._rpg.play(
        this.entity.vo.avatarName,
        -1,
        this.display,
        CallBack.alloc(this, this.onLoadRpg),
      );
    }
    emitter.emit(BaseEvent.ADD_TO_SCENE, this);
  }

  stop() {
    super.stop();
    this._isLoadAtlas = false;
    emitter.emit(BaseEvent.REMOVE_FROM_SCENE, this);
  }

  private onLoadRpg(): void {
    this._isLoadAtlas = true;
  }

  public tick(delta: number): void {
    const vo = this.entity.vo;
    const point = this.entity.vo.point;
    if (this.display.x !== point.x) {
      this.display.x = point.x || 0;
    }
    if (this.display.y !== point.y) {
      this.display.y = point.y || 0;
    }
    if (vo.action && vo.action !== this._curAction) {
      this._curAction = vo.action;
      this._rpg.setAction(vo.action);
    }
  }
}
