import { ISceneUpdate } from "@base/BaseConst";
import { SceneEntityVO } from "./SceneEntityVO";
import { BaseComponent } from "@base/component/BaseComponent";
import {
  CompType,
  CompTypeMap,
  ICompTypeMap,
} from "@base/component/CompsConst";
import PoolMgr from "@base/core/PoolMgr";

/**场景实体*/
export class SceneEntity implements ISceneUpdate {
  private _comps: Record<number, BaseComponent> = {};

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

  private _isDone: boolean = false;
  public set isDone(value: boolean) {
    this._isDone = value;
  }

  public get isDone(): boolean {
    return this._isDone;
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
    // CompMgr.addComp(compIns);
    return <ICompTypeMap[K]>compIns;
  }

  public getComp<K extends keyof ICompTypeMap>(type: K): ICompTypeMap[K] {
    return <ICompTypeMap[K]>this._comps[type];
  }

  public removeComp(type: CompType | number): boolean;
  public removeComp<K extends keyof ICompTypeMap>(type: K): boolean {
    if (!this._comps[type]) {
      return false;
    }
    const compIns = <ICompTypeMap[K]>this._comps[type];
    compIns.stop();
    compIns.entity = null;
    // CompMgr.removeComp(compIns);
    compIns.type = CompType.NONE;
    this._comps[type] = null;
    delete this._comps[type];
    return true;
  }

  public update(elapsed: number): void {
    if (!this.vo) return;

    const delTmp: BaseComponent[] = [];
    const keys = Object.keys(this._comps);
    for (const key of keys) {
      const comp = <BaseComponent>this._comps[key];
      if (comp && comp.isRun) {
        comp.tick(elapsed);
      } else {
        delTmp.push(comp);
      }
    }
    if (delTmp.length) {
      for (const tmp of delTmp) {
        if (tmp) this.removeComp(tmp.type);
      }
      delTmp.length = 0;
    }
  }

  public destroy(): void {
    PoolMgr.release(this);
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
    this._isDone = false;
    this._vo = <any>undefined;
  }
}
