import { BaseComp } from "./BaseComp";
import { CompType } from "./CompsConst";
import { emitter } from "@base/MessageMgr";
import { BaseEvent } from "@base/BaseConst";
import Animation = Laya.Animation;
import Handler = Laya.Handler;
import UIComponent = Laya.UIComponent;

/**
 * 场景模型
 */
export class AvatarComp extends BaseComp {
  private _animation: Animation;
  private _display: UIComponent;

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
      this.display.x = this.display.y = 100;
      this.display.width = 200;
      this.display.height = 200;
      this.display.graphics.drawRect(0, 0, 200, 200, "#0f0f0f");
      this.display.anchorX = 0.5;
      this.display.anchorY = 0.5;
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
