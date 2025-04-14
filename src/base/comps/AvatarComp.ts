import { BaseComp } from "./BaseComp";
import { CompType } from "./CompsConst";
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import { Action, Direction } from "@base/entity/EntityConst";
import { RpgMovieClip } from "@base/movieclip/RpgMovieClip";
import { CallBack } from "@base/CallBack";
import { HeadUI } from "@base/entity/HeadUI";
import PoolMgr from "@base/core/PoolMgr";
import Sprite = Laya.Sprite;

function getDirectionScale(dir: number): { x: number; y: number } {
  if (dir === Direction.LEFT) {
    return { x: -1, y: 1 };
  }
  return { x: 1, y: 1 };
}

/**
 * 场景模型
 */
export class AvatarComp extends BaseComp {
  private _display: Sprite;
  private _curAction: Action;
  private _isLoadAtlas = false;
  private _rpg: RpgMovieClip;
  private _headUI: HeadUI;

  public get display(): Sprite {
    return this._display;
  }

  public set display(value: Laya.Sprite) {
    this._display = value;
  }

  constructor() {
    super();
    this.type = CompType.AVATAR;
  }

  public start(): void {
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
    const scale = getDirectionScale(this.entity.vo.dir);
    this._rpg.scale(scale.x, scale.y);

    if (!this._headUI) {
      this._headUI = PoolMgr.alloc(HeadUI);
      this._headUI.entity = this.entity;
      this.display.addChild(this._headUI);
      this._headUI.y = -50;
      this._headUI.x = -(this._headUI.width / 2) + -scale.x * 20;
    }

    emitter.emit(BaseEvent.ADD_TO_SCENE, this);
  }

  public stop(): void {
    super.stop();
    this._isLoadAtlas = false;
    emitter.emit(BaseEvent.REMOVE_FROM_SCENE, this);
    if (this._headUI) {
      PoolMgr.release(this._headUI);
      this._headUI = <any>undefined;
    }
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
