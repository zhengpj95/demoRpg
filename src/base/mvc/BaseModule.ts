/**
 * @date 2024/4/10
 */
import { ModuleType, ProxyType } from "@def/ModuleConst";
import { BaseProxy } from "./BaseProxy";
import { BaseCommand } from "./BaseCommand";
import { emitter } from "../MessageMgr";
import { LayerIndex } from "@base/LayerMgr";
import { DebugMgr } from "@base/DebugMgr";
import { BaseMediator } from "@base/mvc/BaseMediator";

type MdrCls = new () => Laya.Scene;
type CmdCls = new () => BaseCommand;

export abstract class BaseModule {
  public name: ModuleType;
  private _proxyMap: { [type: number]: BaseProxy } = {};
  private _mdrMap: { [type: number]: MdrCls } = {};
  private _mdrMap2: { [type: number]: new () => BaseMediator } = {};
  private _cmdMap: { [type: number]: CmdCls } = {};
  private _mdrLayerIdxMap: { [type: number]: LayerIndex } = {}; // 所属层级

  protected constructor(module: ModuleType) {
    this.name = module;
  }

  public onReg(): void {
    this.initCmd();
    this.initProxy();
    this.initMdr();
  }

  // 子类继承
  protected abstract initCmd(): void;

  // 子类继承
  protected abstract initProxy(): void;

  // 子类继承
  protected abstract initMdr(): void;

  public regCmd(event: string, cls: CmdCls): void {
    emitter.on(event, this.exeCmd, this, [event]);
    this._cmdMap[event] = cls;
  }

  private exeCmd(event: string, args?: any): void {
    const cls = this._cmdMap[event];
    if (cls) {
      const cmd: BaseCommand = new cls();
      cmd.exec(args);
    }
  }

  public regProxy(type: ProxyType, proxy: new () => BaseProxy): void {
    if (this._proxyMap[type]) {
      return;
    }
    const cls = new proxy(); // 单例模式，实例化保存
    cls.init();
    this._proxyMap[type] = cls;
    DebugMgr.ins().debugProxy(cls);
  }

  public retProxy<T extends BaseProxy>(type: ProxyType): T {
    return <T>this._proxyMap[type];
  }

  public regMdr(
    viewType: number,
    mdr: MdrCls,
    layerIdx = LayerIndex.WIN,
  ): void {
    if (this._mdrMap[viewType]) {
      return;
    }
    this._mdrMap[viewType] = mdr;
    this._mdrLayerIdxMap[viewType] = layerIdx;
  }

  public retMdr(viewType: number): MdrCls {
    return this._mdrMap[viewType];
  }

  public retMdrIdx(viewType: number): LayerIndex {
    return this._mdrLayerIdxMap[viewType];
  }

  public regMdr2(viewType: number, mdr: new () => BaseMediator): void {
    if (this._mdrMap2[viewType]) {
      return;
    }
    this._mdrMap2[viewType] = mdr;
  }

  public retMdr2(viewType: number): new () => BaseMediator {
    return this._mdrMap2[viewType];
  }
}
