import { BaseComp } from "./BaseComp";
import { CompType } from "./CompsConst";
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import { Action } from "@base/entity/EntityConst";
import Animation = Laya.Animation;
import Handler = Laya.Handler;
import UIComponent = Laya.UIComponent;

/**
 * 场景模型
 */
export class AvatarComp extends BaseComp {
  private _animation: Animation;
  private _display: UIComponent;
  private _curAction: Action;
  private _isLoadAtlas = false;

  get display(): UIComponent {
    return this._display;
  }

  set display(value: Laya.UIComponent) {
    this._display = value;
  }

  constructor() {
    super();
    this.type = CompType.AVATAR;
  }

  start() {
    super.start();
    if (!this._animation) {
      this._animation = new Animation();
    }
    if (!this.display) {
      this.display = new UIComponent();
      this.display.name = "avatarComp";
      const point = this.entity.vo.point;
      this.display.x = point ? point.x : 0;
      this.display.y = point ? point.y : 0;
    }
    // this._animation.loadAtlas("player/Rogue/Attack_Extra.atlas", Handler.create(this, this.onLoadComplete));

    emitter.emit(BaseEvent.ADD_TO_SCENE, this);
  }

  stop() {
    super.stop();

    emitter.emit(BaseEvent.REMOVE_FROM_SCENE, this);
  }

  private onLoadComplete(): void {
    this._isLoadAtlas = false;
    this._animation.interval = 200;
    this._animation.play();
    this._display.addChild(this._animation);
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
      if (!this._isLoadAtlas) {
        this._curAction = vo.action;
        this._isLoadAtlas = true;
        this._animation.loadAtlas(
          `${vo.avatarName}/${vo.action}.atlas`,
          Handler.create(this, this.onLoadComplete),
        );
      }
    }
  }
}
