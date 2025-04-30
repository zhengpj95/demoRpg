import Sprite = Laya.Sprite;
import SingletonClass from "@base/core/SingletonClass";

// 层级
export const enum LayerIndex {
  MAP = 0,
  MAIN = 1,
  MODAL = 2,
  TIPS = 3,
}

class BaseLayer extends Sprite {
  public idx: number;

  constructor(idx: number) {
    super();
    this.idx = idx;
    this.name = "layer_" + idx;
    this.mouseThrough = true;
  }

  public onResize(): void {
    this.width = Laya.stage.width;
    this.height = Laya.stage.height;
  }
}

class MapLayer extends BaseLayer {
  constructor() {
    super(LayerIndex.MAP);
  }
}

class MainLayer extends BaseLayer {
  constructor() {
    super(LayerIndex.MAIN);
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
  private readonly _layers: { [idx: number]: BaseLayer } = Object.create(null);
  public static ins: () => LayerMgr;

  constructor() {
    super();
    this._layers = {};
    this.setLayer(new MapLayer());
    this.setLayer(new MainLayer());
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
