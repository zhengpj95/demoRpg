import Sprite = Laya.Sprite;
import Handler = Laya.Handler;
import { LayerMgr } from "../LayerMgr";

/**
 * @date 2025/4/26
 */
export abstract class BaseMediator<T extends Laya.Sprite = Laya.Sprite> {
  public ui: T | undefined = undefined;
  public params: any;
  public __name__: string;

  protected isOpened: boolean = false;
  protected parent: Sprite;
  protected uiUrl: string;

  protected constructor(url: string, parent: any) {
    this.uiUrl = url;
    if (typeof parent === "number") {
      this.parent = LayerMgr.ins().getLayer(parent);
    } else {
      this.parent = parent;
    }
  }

  // 打开界面（传入参数）
  public open(params?: any): void {
    if (!this.uiUrl) {
      throw new Error("BaseMediator uiUrl error!!!");
    }
    this.params = params;
    if (!this.ui) {
      Laya.Scene.load(
        this.uiUrl,
        Handler.create(this, (scene: Laya.Scene) => {
          this.ui = scene as unknown as T;
          this.ui.name = this.__name__;
          this.ui["_mediator_"] = this; // 需要在添加到场景前处理
          this.parent.addChild(this.ui);
          this.onUILoaded();
        }),
      );
    } else {
      this.onUILoaded();
    }
  }

  // 关闭界面
  public close(): void {
    if (!this.isOpened) {
      return;
    }
    this.isOpened = false;
    this.removeEvents();
    this.onClose();
    this.destroyUI();
  }

  // 加载完界面资源后
  private onUILoaded(): void {
    this.initUI();
    this.addEvents();
    this.isOpened = true;
    this.onOpen();
  }

  // 初始化界面内容（子类重写）
  protected abstract initUI(): void;

  // 添加事件监听（子类重写）
  protected abstract addEvents(): void;

  // 打开完成（子类可选重写）
  protected abstract onOpen(): void;

  // 关闭完成（子类可选重写）
  protected abstract onClose(): void;

  // 移除事件监听（子类重写）
  protected abstract removeEvents(): void;

  // 关闭时销毁UI
  protected destroyUI(): void {
    if (this.ui) {
      this.ui.removeSelf();
      this.ui.destroy(true);
      this.ui = null;
    }
    this.parent = <any>undefined;
    this.uiUrl = <any>undefined;
  }
}
