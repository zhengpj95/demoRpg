import Sprite = Laya.Sprite;
import Handler = Laya.Handler;
import { LayerMgr } from "../LayerMgr";
import { BaseModule } from "@base/mvc/BaseModule";
import { ModuleName } from "@def/ModuleConst";
import { BaseEmitter } from "@base/mvc/BaseEmitter";

const MdrName = "__name__";
const MdrKey = "_mediator_";

export function findMediator<T extends BaseMediator<any>>(
  comp: Laya.Node & { [MdrKey]?: T },
): T | undefined {
  if (!comp) return undefined;
  let mdr: T | undefined = comp[MdrKey];
  while (comp && !mdr) {
    comp = comp.parent;
    if (comp[MdrKey] && comp[MdrKey] instanceof BaseMediator) {
      mdr = comp[MdrKey];
    }
  }
  return <T>mdr;
}

/**
 * @date 2025/4/26
 */
export abstract class BaseMediator<
  T extends Laya.Sprite = Laya.Sprite,
> extends BaseEmitter {
  protected ui: T | undefined = undefined;
  protected params: any;

  protected isOpened: boolean = false;
  protected parent: Sprite;
  protected uiUrl: string;

  protected _module: BaseModule;
  protected _moduleName: ModuleName;
  protected _viewType: number;

  protected constructor(url: string, parent: any) {
    super();
    this.uiUrl = url;
    if (typeof parent === "number") {
      this.parent = LayerMgr.ins().getLayer(parent);
    } else {
      this.parent = parent;
    }
  }

  public setModule(module: BaseModule): void {
    this._module = module;
    this._moduleName = module.name;
  }

  public setViewType(view: number): void {
    this._viewType = view;
  }

  public getViewType(): number {
    return this._viewType;
  }

  public setName(name: string): void {
    Object.defineProperty(this, MdrName, {
      value: name,
      configurable: false,
      enumerable: false,
      writable: true,
    });
  }

  public getName(): string {
    return this[MdrName];
  }

  // 打开界面（传入参数）
  public open(params?: any): void {
    this.params = params;
    if (!this.ui && this.uiUrl) {
      Laya.Scene.load(
        this.uiUrl,
        Handler.create(this, (scene: Laya.Scene) => {
          this.onUILoaded(scene as unknown as T);
        }),
      );
    } else {
      // 没有皮肤情况下，自己重写initView，创建ui
      this.initView(Handler.create(this, this.onUILoaded));
    }
  }

  // 关闭界面
  public close(): void {
    if (!this.isOpened) {
      return;
    }
    console.log(`关闭界面 m:${this._moduleName},v:${this._viewType}`);
    this.isOpened = false;
    this.removeEvents();
    this.onClose();
    this.destroyUI();
    this.removeMdr();
  }

  // 没有皮肤情况下，自己重写initView，创建ui（子类重写）
  protected initView(handler: Handler): void {
    //
  }

  // 加载完界面资源后
  private onUILoaded(view: T): void {
    this.ui = view as unknown as T;
    this.ui.name = this[MdrName];
    Object.defineProperty(this.ui, MdrKey, {
      value: this,
      configurable: false,
      enumerable: false,
      writable: true,
    }); // 需要在添加到场景前处理
    this.parent.addChild(this.ui);

    this.initUI();
    this.addEvents();
    this.isOpened = true;
    console.log(`打开界面 m:${this._moduleName},v:${this._viewType}`);
    this._module.regMdrIns(this);
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
      this.ui = undefined;
    }
    this.parent = <any>undefined;
    this.uiUrl = <any>undefined;
  }

  // 移除mdr实例
  private removeMdr(): void {
    this._module.removeMdrIns(this._viewType);
    this._viewType = <any>undefined;
    this._moduleName = <any>undefined;
    this._module = <any>undefined;
  }
}
