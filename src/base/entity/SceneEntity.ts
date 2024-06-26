import { IPoolObject } from "@base/BaseConst";
import {
  SceneDropVO,
  SceneEntityVO,
  SceneMonsterVo,
  ScenePlayerVO,
} from "./SceneEntityVO";
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
    compIns.start();
    CompMgr.addComp(compIns);
    this._comps[type] = compIns;
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
    compIns.type = CompType.NONE;
    compIns.entity = null;
    compIns.stop();
    CompMgr.removeComp(compIns);
    this._comps[type] = null;
    delete this._comps[type];
    return true;
  }

  public tick(delta: number): void {
    //
  }

  onAlloc(): void {
    //
  }

  onRelease(): void {
    //
  }
}

export class ScenePlayer extends SceneEntity {
  init(vo: ScenePlayerVO) {
    super.init(vo);
    this.addComp(CompType.AVATAR);
  }
}

export class SceneMonster extends SceneEntity {
  init(vo: SceneMonsterVo) {
    super.init(vo);
    this.addComp(CompType.AVATAR);
    this.addComp(CompType.MOVE);
  }
}

export class SceneDrop extends SceneEntity {
  init(vo: SceneDropVO) {
    super.init(vo);
  }
}
