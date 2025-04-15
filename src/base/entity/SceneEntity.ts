import { IPoolObject } from "@base/BaseConst";
import { SceneEntityVO } from "./SceneEntityVO";
import { BaseComp } from "@base/comps/BaseComp";
import { CompMgr } from "@base/comps/CompMgr";
import { CompType, CompTypeMap, ICompTypeMap } from "@base/comps/CompsConst";

/**场景实体*/
export class SceneEntity implements IPoolObject {
  private _comps: Record<number, BaseComp> = {};

  private _vo: SceneEntityVO;
  get vo(): SceneEntityVO {
    return this._vo;
  }

  set vo(value: SceneEntityVO) {
    this._vo = value;
  }

  private _battle: SceneEntity;
  get battle(): SceneEntity {
    return this._battle;
  }

  set battle(value: SceneEntity) {
    this._battle = value;
  }

  public init(vo: SceneEntityVO): void {
    this.vo = vo;
  }

  public addComp<K extends keyof ICompTypeMap>(type: K): ICompTypeMap[K] {
    if (this._comps[type]) {
      return <ICompTypeMap[K]>this._comps[type];
    }
    const comp = CompTypeMap[type];
    const compIns = new comp();
    compIns.type = type;
    compIns.entity = this;
    this._comps[type] = compIns;
    compIns.start();
    CompMgr.addComp(compIns);
    return <ICompTypeMap[K]>compIns;
  }

  public getComp<K extends keyof ICompTypeMap>(type: K): ICompTypeMap[K] {
    return <ICompTypeMap[K]>this._comps[type];
  }

  public removeComp<K extends keyof ICompTypeMap>(type: K): boolean {
    if (!this._comps[type]) {
      return false;
    }
    const compIns = <ICompTypeMap[K]>this._comps[type];
    compIns.entity = null;
    compIns.stop();
    CompMgr.removeComp(compIns);
    compIns.type = CompType.NONE;
    this._comps[type] = null;
    delete this._comps[type];
    return true;
  }

  public tick(delta: number): void {
    //
  }

  public destroy(): void {
    this.onRelease();
  }

  public onAlloc(): void {
    this._comps = {};
    this.vo = <any>undefined;
    this.battle = <any>undefined;
  }

  public onRelease(): void {
    const keys = Object.keys(this._comps);
    for (const key of keys) {
      this.removeComp(+key);
    }
    this._comps = {};
  }
}
