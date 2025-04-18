import { SceneEntity } from "../entity/SceneEntity";
import { CompType } from "./CompsConst";
import { IPoolObject } from "@base/BaseConst";

/**
 * 实体组件基类
 */
export class BaseComponent implements IPoolObject {
  /** 组件所属类型  */
  private _type: CompType;
  /** 组件在运行否 */
  private _isRun: boolean;
  /** 组件所属场景实体 */
  private _entity: SceneEntity;

  get entity(): SceneEntity {
    return this._entity;
  }

  set entity(value: SceneEntity) {
    this._entity = value;
  }

  get isRun(): boolean {
    return this._isRun;
  }

  set isRun(value: boolean) {
    this._isRun = value;
  }

  get type(): CompType {
    return this._type;
  }

  set type(value: CompType) {
    this._type = value;
  }

  public start(): void {
    this.isRun = true;
  }

  public stop(): void {
    this.isRun = false;
  }

  public onAlloc(): void {
    this._isRun = false;
    this._type = CompType.NONE;
    this._entity = <any>undefined;
  }

  public onRelease(): void {
    this._isRun = false;
    this._type = CompType.NONE;
    this._entity = <any>undefined;
  }

  public tick(delta: number): void {
    //
  }
}
