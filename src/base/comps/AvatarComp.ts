import { BaseComp } from "./BaseComp";
import { CompType } from "./CompsConst";
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import Animation = Laya.Animation;
import Handler = Laya.Handler;
import Sprite = Laya.Sprite;

/**
 * 场景模型
 */
export class AvatarComp extends BaseComp {
  private _animation: Animation;
  private _display: Sprite;

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
    if (!this._animation) {
      this._animation = new Animation();
    }
    if (!this.display) {
      this.display = new Sprite();
      this.display.name = "avatarComp";
    }
    this._animation.loadAtlas(
      "player/move_4.atlas",
      Handler.create(this, this.onLoadComplete),
    );

    emitter.emit(BaseEvent.ADD_TO_SCENE, this);
  }

  stop() {
    super.stop();

    emitter.emit(BaseEvent.REMOVE_FROM_SCENE, this);
  }

  private onLoadComplete(): void {
    this._animation.interval = 200;
    this._animation.play();
    this._display.addChild(this._animation);
  }
}
