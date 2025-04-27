import Script = Laya.Script;
import Handler = Laya.Handler;
import UIComponent = Laya.UIComponent;
import Event = Laya.Event;
import Tween = Laya.Tween;
import { BaseMediator, findMediator } from "@base/mvc/BaseMediator";

const DOWN_CLICK_SCALE = 1.1;
const UP_CLICK_SCALE = 0.94;
const CLICK_SCALE_TIME = 100;
const ORI_PRO_KEY = ["left", "right", "top", "bottom", "centerX", "centerY"];

/**
 * @date 2024/6/3
 */
export default class ClickScale extends Script {
  /** @prop {name:mdrCall,tips:"回调mdr中的方法",type:String,default=""} */
  public mdrCall: string = "";
  /** @prop {name:noScale,tips:"点击不缩放效果,默认：false",type:Check,default=false} */
  public noScale = false;
  /** @prop {name:stopClickPropagation,tips:"是否阻止点击事件上冒,默认：false",type:Check,default=false} */
  public stopClickPropagation = false;
  /** @prop {name:clickInterval,tips:"点击触发时间间隔220毫秒",type:Check,default=false} */
  public clickInterval = false;

  private comp: UIComponent;
  private originX = 0;
  private originY = 0;
  private originScaleX = 1; // 初始尺寸
  private originScaleY = 1;
  private downScaleX = 1; // 按下尺寸
  private downScaleY = 1;
  private upScaleX = 1; // 松开尺寸
  private upScaleY = 1;

  private prevClickTime = 0;
  private isSetPos = false;
  private isTweenUp = false;

  private mdr?: BaseMediator | undefined;
  private mdrCallback?: Handler;
  private _oriMap: { [key: string]: number };

  public onAwake(): void {
    this.comp = <UIComponent>this.owner;
    this.mdr = findMediator<BaseMediator>(this.comp);
    this.originX = this.comp.x;
    this.originY = this.comp.y;
    this.originScaleX = this.comp.scaleX;
    this.originScaleY = this.comp.scaleY;
    this.downScaleX = this.comp.scaleX * DOWN_CLICK_SCALE;
    this.downScaleY = this.comp.scaleY * DOWN_CLICK_SCALE;
    this.upScaleX = this.comp.scaleX * UP_CLICK_SCALE;
    this.upScaleY = this.comp.scaleY * UP_CLICK_SCALE;

    if (!this._oriMap) {
      this._oriMap = {};
      for (const key of ORI_PRO_KEY) {
        if (!isNaN(this.comp[key])) {
          this._oriMap[key] = this.comp[key];
        }
      }
    }
  }

  public onEnable(): void {
    this.setAnchor();
    this.updateWidget(false);
    this.comp.on(Event.LOADED, this, this.setAnchor);
    this.comp.on(Event.CLICK, this, this.onClickComp);
    this.comp.on(Event.MOUSE_DOWN, this, this.onClickMouseDown);
    this.comp.on(Event.MOUSE_UP, this, this.onClickMouseUp);
    this.comp.on(Event.MOUSE_OUT, this, this.onClickMouseUp);

    if (this.mdr) {
      this.mdrCallback = Handler.create(
        this.mdr,
        this.mdr[this.mdrCall],
        undefined,
        false,
      );
    }
  }

  public onDestroy(): void {
    this.mdr = undefined;
    if (this.mdrCallback) {
      this.mdrCallback = undefined;
    }
  }

  private setAnchor(): void {
    const comp = this.comp;
    if (
      comp.width === 0 ||
      comp.height === 0 ||
      this.isSetPos ||
      this.noScale
    ) {
      return;
    }

    this.isSetPos = true;
    comp.anchorX = comp.anchorY = 0.5;
    comp.x = this.originX + comp.width * this.originScaleX * 0.5;
    comp.y = this.originY + comp.height * this.originScaleY * 0.5;
  }

  private updateWidget(isAnim = false): void {
    if (isAnim) {
      for (const key of ORI_PRO_KEY) {
        this.comp[key] = NaN;
      }
    } else {
      for (const key in this._oriMap) {
        this.comp[key] = this._oriMap[key];
      }
    }
  }

  private onClickComp(e: Event): void {
    if (e && this.stopClickPropagation) {
      e.stopPropagation();
    }
    if (this.clickInterval) {
      if (Date.now() - this.prevClickTime < 220) {
        return;
      }
      this.prevClickTime = Date.now();
    }
    if (this.mdrCallback) {
      this.mdrCallback.run();
    }
  }

  private onClickMouseDown(): void {
    if (this.noScale) {
      return;
    }
    this.isTweenUp = false;
    Tween.clearAll(this.comp);
    Tween.to(
      this.comp,
      {
        scaleX: this.downScaleX,
        scaleY: this.downScaleY,
      },
      CLICK_SCALE_TIME,
    );
    this.updateWidget(true);
  }

  private onClickMouseUp(): void {
    if (
      this.noScale ||
      this.isTweenUp ||
      (this.comp.scaleX === this.originScaleX &&
        this.comp.scaleY === this.originScaleY)
    ) {
      return;
    }
    this.isTweenUp = true;
    Tween.to(
      this.comp,
      {
        scaleX: this.upScaleX,
        scaleY: this.upScaleY,
      },
      CLICK_SCALE_TIME,
      null,
      Handler.create(this, this.tweenOriginScale),
    );
  }

  private tweenOriginScale(): void {
    Tween.to(
      this.comp,
      {
        scaleX: this.originScaleX,
        scaleY: this.originScaleY,
      },
      CLICK_SCALE_TIME,
      null,
      Handler.create(this, this.updateWidget, [false]),
    );
  }
}
