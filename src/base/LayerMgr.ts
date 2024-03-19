import UIComponent = Laya.UIComponent;

export const enum LayerIndex {
  MAP = 0,
  WIN = 1,
  MODAL = 2,
}

// todo
export interface IBaseMdr {
  _layerIndex_: LayerIndex;
}

class BaseLayer extends UIComponent {
  public idx: number;

  constructor(idx: number) {
    super();
    this.idx = idx;
    this.name = "_idx" + idx;
    this.mouseThrough = true;
  }

  onResize(): void {
    this.width = Laya.stage.width;
    this.height = Laya.stage.height;
  }
}

class MapLayer extends BaseLayer {
  //
}

class WinLayer extends BaseLayer {
  //
}

class ModalLayer extends BaseLayer {
  //
}

export class LayerMgr {
  public static bgMain = new MapLayer(LayerIndex.MAP);
  public static winMain = new WinLayer(LayerIndex.WIN);
  public static modalMain = new ModalLayer(LayerIndex.MODAL);

  public static init(): void {
    const stage = Laya.stage;
    stage.addChild(LayerMgr.bgMain);
    stage.addChild(LayerMgr.winMain);
    stage.addChild(LayerMgr.modalMain);
  }

  public static showView<T extends Laya.Scene>(mdr: new () => T): void {
    const cls = new mdr();
    if (cls) {
      const idx = <LayerIndex>cls["_layerIndex_"];
      if (idx === LayerIndex.MAP) {
        LayerMgr.bgMain.addChild(cls);
      } else if (idx === LayerIndex.WIN) {
        LayerMgr.winMain.addChild(cls);
      } else if (idx === LayerIndex.MODAL) {
        LayerMgr.modalMain.addChild(cls);
      } else {
        Laya.stage.addChild(cls);
      }
    }
  }

  public static onResize(): void {
    if (!Laya.stage) {
      return;
    }
    const nums = Laya.stage.numChildren;
    for (let i = 0; i < nums; i++) {
      (<BaseLayer>Laya.stage.getChildAt(i)).onResize();
    }
  }
}
