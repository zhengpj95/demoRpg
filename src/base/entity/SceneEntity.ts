import { ISceneUpdate } from "@base/BaseConst";
import { SceneEntityVO } from "./SceneEntityVO";
import { BaseComponent } from "@base/component/BaseComponent";
import {
  ComponentType,
  ComponentTypeMap,
  IComponentTypeMap,
} from "@base/component/ComponentConst";
import PoolMgr from "@base/core/PoolMgr";

/**场景实体*/
export class SceneEntity implements ISceneUpdate {
  private _components: Record<number, BaseComponent> = {};

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

  public addComponent<K extends keyof IComponentTypeMap>(
    type: K,
  ): IComponentTypeMap[K] {
    if (this._components[type]) {
      return <IComponentTypeMap[K]>this._components[type];
    }
    const comp = ComponentTypeMap[type];
    const compIns = new comp();
    compIns.type = type;
    compIns.entity = this;
    this._components[type] = compIns;
    compIns.start();
    // CompMgr.addComp(compIns);
    return <IComponentTypeMap[K]>compIns;
  }

  public getComponent<K extends keyof IComponentTypeMap>(
    type: K,
  ): IComponentTypeMap[K] {
    return <IComponentTypeMap[K]>this._components[type];
  }

  public removeComponent(type: ComponentType | number): boolean;
  public removeComponent<K extends keyof IComponentTypeMap>(type: K): boolean {
    if (!this._components[type]) {
      return false;
    }
    const compIns = <IComponentTypeMap[K]>this._components[type];
    compIns.stop();
    compIns.entity = null;
    // CompMgr.removeComp(compIns);
    compIns.type = ComponentType.NONE;
    this._components[type] = null;
    delete this._components[type];
    return true;
  }

  public update(elapsed: number): void {
    if (!this.vo) return;

    const delTmp: BaseComponent[] = [];
    const keys = Object.keys(this._components);
    for (const key of keys) {
      const comp = <BaseComponent>this._components[key];
      if (comp && comp.isRun) {
        comp.tick(elapsed);
      } else {
        delTmp.push(comp);
      }
    }
    if (delTmp.length) {
      for (const tmp of delTmp) {
        if (tmp) this.removeComponent(tmp.type);
      }
      delTmp.length = 0;
    }
  }

  public destroy(): void {
    PoolMgr.release(this);
    this.onRelease();
  }

  public onAlloc(): void {
    this._components = {};
    this.vo = <any>undefined;
    this.battle = <any>undefined;
  }

  public onRelease(): void {
    const keys = Object.keys(this._components);
    for (const key of keys) {
      this.removeComponent(+key);
    }
    this._components = {};
    this._isDone = false;
    this._vo = <any>undefined;
  }
}
