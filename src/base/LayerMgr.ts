import UIComponent = Laya.UIComponent;
import SingletonClass from "@base/core/SingletonClass";

// 层级
export const enum LayerIndex {
  MAP = 0,
  WIN = 1,
  MODAL = 2,
  TIPS = 3,
}

class BaseLayer extends UIComponent {
  public idx: number;
  public mdrMap: { [view: number]: Laya.Scene };

  constructor(idx: number) {
    super();
    this.idx = idx;
    this.name = "layer_" + idx;
    this.mouseThrough = true;
    this.mdrMap = {};
  }

  public onResize(): void {
    this.width = Laya.stage.width;
    this.height = Laya.stage.height;
  }

  public removeAll(): void {
    const numChild = this.numChildren;
    for (let i = 0; i < numChild; i++) {
      const child = this.getChildAt(i);
      if (!child) continue;
      if (child instanceof Laya.Scene) {
        child.close();
        const mdrKey = child.name;
        this.mdrMap[mdrKey] = undefined;
        delete this.mdrMap[mdrKey];
      }
      child.removeSelf();
    }
  }

  // 添加mdr
  public doAddMdr(mdr: new () => Laya.Scene, mdrKey: string): boolean {
    if (this.mdrMap[mdrKey]) {
      return true;
    }
    const cls = new mdr();
    cls.name = mdrKey;
    this.addChild(cls);
    cls.open(false);
    this.mdrMap[mdrKey] = cls;
    return true;
  }

  // 移除mdr
  public doRemoveMdr(mdrKey: string): boolean {
    if (!this.mdrMap[mdrKey]) {
      return false;
    }
    const mdr: Laya.Scene = this.mdrMap[mdrKey];
    if (mdr) {
      mdr.close();
      mdr.removeSelf();
      mdr.destroy();
    }
    this.mdrMap[mdrKey] = undefined;
    delete this.mdrMap[mdrKey];
    return true;
  }
}

class MapLayer extends BaseLayer {
  constructor() {
    super(LayerIndex.MAP);
  }
}

class WinLayer extends BaseLayer {
  constructor() {
    super(LayerIndex.WIN);
  }
}

class ModalLayer extends BaseLayer {
  constructor() {
    super(LayerIndex.MODAL);
  }
}

class TipsLayer extends BaseLayer {
  constructor() {
    super(LayerIndex.TIPS);
  }
}

/**
 * 层级管理器
 * 单例模式，使用LayerMgr.ins()调用，业务逻辑可通过App.layerMgr调用
 */
export class LayerMgr extends SingletonClass {
  private readonly _layers: { [idx: number]: BaseLayer } = {};
  public static ins: () => LayerMgr;

  constructor() {
    super();
    this._layers = {};
    this.setLayer(new MapLayer());
    this.setLayer(new WinLayer());
    this.setLayer(new ModalLayer());
    this.setLayer(new TipsLayer());
  }

  public setLayer(layer: BaseLayer): void {
    this._layers[layer.idx] = layer;
    Laya.stage.addChild(layer);
  }

  public getLayer(idx: LayerIndex): BaseLayer {
    return this._layers[idx];
  }

  public onResize(): void {
    if (!Laya.stage) {
      return;
    }
    for (const idx in this._layers) {
      const layer = this._layers[idx];
      layer && layer.onResize();
    }
  }
}
