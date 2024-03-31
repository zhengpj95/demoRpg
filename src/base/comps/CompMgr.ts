import { BaseComp } from "./BaseComp";

/**
 * 实体管理器
 */
export class CompMgr {
  private static _compMap: Record<number, BaseComp[]> = {};

  public static addComp(comp: BaseComp): void {
    if (!comp) {
      return;
    }
    if (!this._compMap[comp.type]) {
      this._compMap[comp.type] = [];
    }
    this._compMap[comp.type].push(comp);
  }

  public static removeComp(comp: BaseComp): void {
    if (!comp || !this._compMap[comp.type].length) {
      return;
    }
    const idx = this._compMap[comp.type].indexOf(comp);
    if (idx > -1) {
      this._compMap[comp.type].splice(idx, 1);
    }
  }

  public static start(): void {
    Laya.timer.frameLoop(1, this, this.tick);
  }

  public static stop(): void {
    Laya.timer.clearAll(this);
  }

  public static tick(delta: number): void {
    this.dealComp();
  }

  public static dealComp(): void {
    for (const key in this._compMap) {
      const list = this._compMap[key];
      if (list.length) {
        list.forEach((comp) => {
          if (comp.isRun) {
            comp.tick(Laya.timer.delta);
          }
        });
      }
    }
  }
}
