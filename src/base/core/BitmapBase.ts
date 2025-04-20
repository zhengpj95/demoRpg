import Sprite = Laya.Sprite;
import Texture = Laya.Texture;
import Event = Laya.Event;
import Handler = Laya.Handler;
import { IPoolObject } from "@base/BaseConst";

/**
 * Laya.loader.load的优先级：
 * 加载的优先级，优先级高的优先加载。有0-4共5个优先级，0最高，4最低
 */
export const enum LoadPriority {
  FIRST = 0,
  UI = 1,
  UI_SCENE = 2,
  SCENE = 3,
  DEFAULT = 4,
}

/** 重置Sprite */
export function resetDisplay(dis: Sprite): void {
  if (!dis || dis.destroyed) {
    return;
  }
  (<any>dis)._bits = 0;
  dis.x = dis.y = 0;
  dis.scaleX = dis.scaleY = dis.alpha = 1;
  dis.rotation = 0;
  dis.width = dis.height = NaN;
  dis.pivot(0, 0);
  dis.visible = true;
  dis.filters = <any>null;
}

/**
 * @date 2024/6/12
 */
export class BitmapBase extends Sprite implements IPoolObject {
  private _source?: Texture | string;
  private _oldStr: string = "";
  public keepOnRem: boolean = false;
  public center: boolean = false;
  public loadPri: LoadPriority = LoadPriority.UI;

  protected _onAdded() {
    super._onAdded();
    if (this.keepOnRem) {
      return;
    }
    if (this._oldStr) {
      if (!this._source) {
        this.source = this._oldStr;
      }
      this._oldStr = "";
    }
  }

  protected _onRemoved() {
    super._onRemoved();
    if (this.keepOnRem) {
      return;
    }
    if (typeof this._source === "string") {
      this._oldStr = this._source;
      this.source = undefined;
    }
  }

  /**
   * 设置显示内容，支持贴图地址，贴图对象
   * @param value
   */
  public set source(value: Texture | string | undefined) {
    if (!value) {
      value = undefined;
    }
    if (value === this._source) {
      if (this.texture) {
        this.resize();
        this.event(Event.COMPLETE);
        this.onLoaded();
      }
      return;
    }
    if (typeof value === "string") {
      this.removeCur();
      this._source = value;
      Laya.loader.load(
        value,
        Handler.create(this, this.onComplete, [value]),
        null,
        null,
        this.loadPri,
      );
      return;
    }
    this.removeCur();
    this._source = value;
    this.texture = <Texture>value;
    this.resize();
  }

  public get source(): Texture | string | undefined {
    return this._source;
  }

  /**
   * 设置轴心点
   * @param x ([0,1])
   * @param y ([0,1])
   */
  public setAnchor(x: number = 0, y: number = 0): void {
    const pivotX = x === 0 ? 0 : this.width * x;
    const pivotY = y === 0 ? 0 : this.height * y;
    this.pivot(pivotX, pivotY);
  }

  private removeCur(): void {
    this.texture = <any>null;
    this._source = undefined;
  }

  private resize(): void {
    const text = this.texture;
    if (text) {
      this.width = text.sourceWidth || text.width;
      this.height = text.sourceHeight || text.height;
    }
    if (this.center) {
      this.pivot(this.width / 2, this.height / 2);
    }
  }

  private onComplete(url: string): void {
    if (this._source !== url) return;
    this.texture = Laya.loader.getRes(url);
    this.resize();
    this.event(Event.COMPLETE);
    this.onLoaded();
  }

  protected onLoaded(): void {
    // 子类重写
  }

  public onAlloc(): void {
    this.loadPri = LoadPriority.UI;
  }

  public onRelease(): void {
    this.center = false;
    this.removeSelf();
    resetDisplay(this);
    this.removeCur();
    this._oldStr = "";
  }
}
